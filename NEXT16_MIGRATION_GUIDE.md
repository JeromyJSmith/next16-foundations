# Next.js 16.0.1 Cache Components Migration Guide

## Overview

Your project is now wired to use Next.js 16's revolutionary **Cache Components** feature. This guide explains the new patterns and how to apply them.

## ✅ What's Been Updated

1. **next.config.ts** - Enabled `useCache` and custom cache profiles
   - Note: In Next.js 16.0.1-canary.2, `cacheLife` is a top-level config option, not under `experimental`
   - The `dynamicIO` flag is no longer needed (automatically enabled with `useCache`)

2. **Cache Profiles Configured**:
   - `seconds`: Near real-time (revalidates every 1s)
   - `minutes`: Frequent updates (revalidates every 1m)
   - `hours`: Daily data (revalidates every 1h)
   - `days`: Weekly data (revalidates every 24h)
   - `agents`: Agent-specific (revalidates every 5m, expires in 1h)

## 🔑 Key Concepts

### 1. **'use cache' Directive**
Marks async components/functions as cacheable. The cache entry persists across requests with the same parameters.

```typescript
async function MyComponent() {
  'use cache'
  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

### 2. **cacheLife() Function**
Defines how long a cached entry should persist. Use predefined profiles or custom objects.

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

async function MyComponent() {
  'use cache'
  cacheLife('hours')  // Use predefined profile
  // OR
  cacheLife({
    stale: 300,      // 5 min - serve stale while revalidating
    revalidate: 3600, // 1 hour - refresh on server
    expire: 86400,   // 24 hours - become dynamic after this
  })
  
  const data = await fetch('/api/data')
  return <div>{data}</div>
}
```

### 3. **cacheTag() Function**
Tags cached entries for selective invalidation. Useful for purging specific data when it changes.

```typescript
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { revalidateTag } from 'next/cache'

async function UserProfile({ userId }) {
  'use cache'
  cacheTag(`user-${userId}`)
  cacheLife('hours')
  
  const user = await db.user.findUnique({ where: { id: userId } })
  return <div>{user.name}</div>
}

// Invalidate when user updates
export async function updateUser(userId, data) {
  await db.user.update({ where: { id: userId }, data })
  revalidateTag(`user-${userId}`)
}
```

### 4. **Suspense Boundaries**
Use for dynamic/real-time data that shouldn't be cached. The component loads independently.

```typescript
import { Suspense } from 'react'

function RealtimeStatus() {
  return <div>Loading...</div>
}

async function LiveEventData() {
  const events = await supabase
    .from('events')
    .select('*')
  return <EventsList events={events} />
}

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* This loads independently, not blocked by slow events */}
      <Suspense fallback={<RealtimeStatus />}>
        <LiveEventData />
      </Suspense>
    </div>
  )
}
```

## 📋 Migration Checklist for Your Project

### Phase 1: Agent Orchestrator Caching
Your orchestrator and component builder agents have specific data patterns:

- [ ] **Orchestrator Status** (created: `agent-orchestrator-status.tsx`)
  - Caches every 5 minutes
  - Falls back gracefully if service offline
  - Tagged for selective invalidation

- [ ] **Agent Statistics API** (created: `api/agents/stats/route.ts`)
  - Endpoint to fetch combined agent metrics
  - Uses 'agents' cache profile
  - Perfect for monitoring dashboards

### Phase 2: Supabase Data Patterns
Once you integrate Supabase in the web app:

```typescript
// ❌ OLD: Fetches every request
async function ComponentList() {
  const { data } = await supabase
    .from('components')
    .select('*')
  return <List items={data} />
}

// ✅ NEW: Cached, revalidates hourly
async function ComponentList() {
  'use cache'
  cacheTag('components')
  cacheLife('hours')
  
  const { data } = await supabase
    .from('components')
    .select('*')
  return <List items={data} />
}

// Revalidate when new components are added
export async function createComponent(component) {
  const result = await supabase.from('components').insert(component)
  revalidateTag('components')
  return result
}
```

### Phase 3: Real-time Subscriptions (Suspense Only)
Supabase realtime subscriptions should NOT use cache:

```typescript
async function RealtimeEvents() {
  // No 'use cache' - this should load on every request
  const subscription = await supabase
    .channel('events')
    .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      console.log('New event:', payload)
    })
    .subscribe()
  
  return <EventMonitor subscription={subscription} />
}

// Use Suspense for graceful fallback
export function Dashboard() {
  return (
    <Suspense fallback={<div>Connecting to live stream...</div>}>
      <RealtimeEvents />
    </Suspense>
  )
}
```

## 🎯 Recommended Patterns for Your Stack

### Pattern 1: Agent Response Caching
Cache agent outputs when they're expensive to generate:

```typescript
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache'

async function GeneratedComponentPreview({ componentId }) {
  'use cache'
  cacheTag(`component-${componentId}`)
  cacheLife('hours')  // Component definitions are stable
  
  const response = await fetch(`http://localhost:8002/api/component/${componentId}`)
  const component = await response.json()
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3>{component.name}</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs">
        <code>{component.code}</code>
      </pre>
    </div>
  )
}
```

### Pattern 2: Mixed Cached + Dynamic
Combine cached static content with dynamic real-time updates:

```typescript
async function Dashboard() {
  'use cache'
  cacheLife('days')
  
  // This cached component renders immediately
  const staticConfig = await db.getConfig()
  
  return (
    <div className="grid gap-6">
      <StaticSection data={staticConfig} />
      
      {/* This streams in independently, not blocked by cache */}
      <Suspense fallback={<LoadingSpinner />}>
        <RealtimeMetrics />
      </Suspense>
    </div>
  )
}
```

### Pattern 3: Cache Invalidation from Server Actions
Update cache when events occur:

```typescript
'use server'

import { revalidateTag } from 'next/cache'

export async function onAgentTaskComplete(taskId: string) {
  // Update database
  await db.updateTask(taskId, { status: 'complete' })
  
  // Invalidate affected caches
  revalidateTag('agent-stats')
  revalidateTag('tasks')
  revalidateTag(`task-${taskId}`)
}
```

## 🚨 Common Mistakes to Avoid

### ❌ DON'T: Cache dynamic/user-specific data with long lifetimes
```typescript
// WRONG - User's data will be stale across users
async function UserDashboard({ userId }) {
  'use cache'
  cacheLife('hours')  // TOO LONG for user-specific data
  const user = await db.getUser(userId)
  return <Dashboard user={user} />
}
```

### ✅ DO: Use short cache or Suspense for user data
```typescript
// CORRECT - Tag ensures each user has separate cache
async function UserDashboard({ userId }) {
  'use cache'
  cacheTag(`user-${userId}`)  // Cache per user
  cacheLife('minutes')          // Short lifetime
  const user = await db.getUser(userId)
  return <Dashboard user={user} />
}
```

### ❌ DON'T: Cache headers/cookies at route level
```typescript
// WRONG - Headers aren't part of cache key
import { cookies } from 'next/headers'

export default async function Page() {
  'use cache'
  const token = (await cookies()).get('token')  // Won't work as expected
  cacheLife('hours')
  return <PageContent />
}
```

### ✅ DO: Move header access to child components
```typescript
// CORRECT - Headers accessed in component that uses them
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UserContent />
    </Suspense>
  )
}

async function UserContent() {
  const token = (await cookies()).get('token')
  const user = await db.getUser(token)
  
  return (
    <div>
      <CachedStats />  {/* Can still be cached */}
      <UserInfo user={user} />
    </div>
  )
}

async function CachedStats() {
  'use cache'
  cacheLife('hours')
  const stats = await db.getGlobalStats()
  return <Stats data={stats} />
}
```

## 📊 Testing Your Cache Configuration

### Verify cache is working:
```bash
# Start dev server
npm run dev:web

# Watch console for cache hits
# First request: "Miss" (computed)
# Second request: "Hit" (served from cache)
# After revalidation time: "Recompute" (refresh)
```

### Check cache tags in network tab:
The response header `X-Cache-Key` shows cache information:
```
X-Cache-Key: f1234567890abcdef-agents
```

## 🔄 Migration Timeline

1. **Now** (Done)
   - ✅ Update next.config.ts
   - ✅ Create example components

2. **Week 1**
   - Cache agent orchestrator status
   - Cache component builder outputs
   - Test with local agents

3. **Week 2**
   - Integrate Supabase caching
   - Implement server actions for invalidation
   - Test with production data

4. **Week 3**
   - Profile and measure cache hit rates
   - Fine-tune cache durations
   - Document patterns for team

## 📚 Examples Created

1. **`agent-orchestrator-status.tsx`** - Server component with caching
2. **`api/agents/stats/route.ts`** - Cached API endpoint
3. **`next.config.ts`** - Updated with cache profiles

## 🔗 Resources

- [Next.js Cache Components Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [cacheLife API Reference](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [Server Actions with Cache Invalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

---

**Questions?** Review the examples or check the Next.js docs above.
