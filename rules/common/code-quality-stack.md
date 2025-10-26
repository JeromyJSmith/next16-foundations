---
description: Code Quality Guidelines for next16-foundations — Next.js 16.0.1, Turborepo, pnpm, Biome, Drizzle ORM, shadcn/ui, Tauri, Agent Orchestration (Python)
globs: 

alwaysApply true

---
---
Repository-Specific Quality Standards

---
### Repository-Specific Quality Standards

- **Workspace Structure**

  - All code must be within relevant workspace folders: `/apps`, `/packages`, `/agents`, `/tasks`
  - Never import directly from `/apps` inside `/packages` (one-way dependency only)
  - Python agent orchestration scripts live strictly under `/agents`; document agent workflows in `/tasks`
- **Dependency & Build Validation**

  - Pin all core dependencies to match repo baseline (Next.js 16.0.1-canary.x, React 19.2.x, tRPC, Drizzle, Tailwind, shadcn/ui, Biome, pnpm, Tauri)
  - Always run `pnpm install` at the repo root, not within subfolders
  - All scripts (dev, build, type-check, lint, db, desktop/PWA, turbo) must execute from a fresh clone on Node.js >= 20.9.0 and TypeScript >= 5.1
- **tRPC & Drizzle API Contracts**

  - tRPC endpoints must use full input/output types — always match backend and frontend types
  - Drizzle schema changes require test and type updates in `/packages/db` and consumers
- **UI Consistency**

  - Use shadcn/ui and Tailwind for all shared UI components across workspaces
  - Do not hardcode styles; use Tailwind utility classes and tokens
- **Linting & Formatting**

  - All formatting is handled by Biome, never manually or via ESLint/Prettier (`pnpm biome` or `pnpm format`)
  - Do not suggest whitespace-only changes; rely on Biome autoformat
- **Type Safety**

  - No `any` or weak types in application code — leverage TypeScript inference
  - Types must be shared through `/packages/types` for cross-app logic
- **Testing**

  - Include test file changes for all implementation changes, stored with the affected package or in `/packages/test`
  - For workflows depending on Python agents, stub/test the integration at API boundaries
- **Agent Orchestration**

  - All Python agent orchestrator logic should be idempotent, reproducible, and documented in the monorepo (in `/agents` and `/tasks`)
  - Types or communication contracts between TS/JS (Next.js) and Python must be defined in `/packages/types` or `/agents/schemas`
  - Document and enforce approval/broker flows for agent actions when building new integrations
- **Desktop & PWA**

  - Tauri desktop builds must work without extra dependencies beyond those in `package.json`
  - PWA assets and service worker config must be updated together in `/apps/web`
- **Database & Security**

  - All Drizzle migrations tracked and present; never remove or destructively alter live tables
  - Use Zod validators for all external input (including tRPC, API, and agent-to-app boundaries)
  - No secrets, tokens, or credentials in code; use `.env.local` for dev and pipeline secrets in production
- **Commits & PRs**

  - Use conventional commit format (`fix(apps/web): ...`, `feat(api): ...`, `chore(db): ...`)
  - Every PR must reference workspace package(s) and affected directory paths, and include/mention all associated tests and docs updates
  - PR must pass: `pnpm build`, `pnpm check-types`, `pnpm biome`, and (if changed) `pnpm desktop:build`
- **Documentation**

  - README, task queue, and API-types docs must be current and inside the repo, next to live code and scripts
  - All breaking architectural changes require an MD doc in `/tasks` or `/docs`

### Enforcement

- CI pipeline must run: `pnpm build`, `pnpm check-types`, `pnpm test`, `pnpm biome`, `pnpm db:generate`
- Agent and Tauri scripts must pass their own validation steps as documented in `/tasks` and `/agents`

---
