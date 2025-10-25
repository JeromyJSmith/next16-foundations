# 🤖 Live Steam App - AI Agent Setup Guide

This guide walks you through setting up the complete A2A + AG-UI agent infrastructure for live-steam-app.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Environment Setup](#environment-setup)
4. [Running Agents](#running-agents)
5. [Testing Agent Communication](#testing-agent-communication)
6. [Troubleshooting](#troubleshooting)
7. [Adding New Agents](#adding-new-agents)

---

## 🚀 Quick Start

### One-Command Setup

```bash
# From project root
pnpm agents:setup
```

This will:
- Create Python virtual environment with `uv`
- Install all Python dependencies
- Create `.env` file template

### Running Everything

```bash
# Terminal 1: Frontend + All Agents (concurrent)
pnpm dev

# OR run them separately for better visibility:
# Terminal 1: Frontend only
pnpm dev:web

# Terminal 2: Orchestrator Agent
pnpm dev:orchestrator

# Terminal 3: Component Builder Agent
pnpm dev:components
```

### Verify Setup

Open your browser and navigate to:
- **Frontend**: http://localhost:3001
- **Orchestrator Health**: http://localhost:9000/health
- **Component Builder Health**: http://localhost:9001/health

---

## 🏗️ Architecture Overview

### Protocol Triangle

```
┌──────────────────────────────────────────┐
│     Frontend (React 19 + Next.js 16)     │
│  ┌───────────────────────────────────┐   │
│  │ CopilotKit + Copilot Chat UI      │   │
│  │ (Agent Communication Interface)   │   │
│  └──────────────┬────────────────────┘   │
└─────────────────┼────────────────────────┘
                  │
       ┌──────────┼──────────┐
       │          │          │
       ▼          ▼          ▼
  /api/copilotkit (AG-UI Middleware)
       │
       ├─ AG-UI Protocol (HTTP)
       │
    ┌──────────────────────┐
    │  Orchestrator Agent  │  :9000
    │  - Google ADK        │
    │  - Gemini 2.5 Pro    │
    │  - Coordinates tasks │
    └──────────┬───────────┘
               │
         A2A Protocol (HTTP)
          (Agent-to-Agent)
               │
        ┌──────┴──────┐
        │             │
    ┌───▼────┐   ┌───▼──────────┐
    │Component│   │   Itinerary  │
    │Builder  │   │   Agent      │
    │:9001    │   │   :9002      │
    │LangGraph│   │ (LangGraph)  │
    │GPT-4o   │   │              │
    └─────────┘   └──────────────┘
```

### Three Communication Protocols

1. **AG-UI Protocol** (Orchestrator ↔ Frontend)
   - Used by orchestrator agent to communicate with frontend
   - HTTP endpoint at `:9000`
   - Exposed to frontend via `/api/copilotkit`

2. **A2A Protocol** (Agent-to-Agent)
   - Used by orchestrator to call specialized agents
   - Component Builder at `:9001`
   - Itinerary agent at `:9002`
   - Each agent has its own HTTP server

3. **A2A Middleware** (Frontend ↔ All Agents)
   - Created in `/api/copilotkit` route
   - Bridges AG-UI and A2A protocols
   - Routes messages between frontend and agents
   - Handles agent discovery and tool injection

---

## 🔧 Environment Setup

### Prerequisites

1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **uv Package Manager** - Fast Python dependency management
   ```bash
   # Install uv
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. **API Keys** (get these before starting)
   - Google API Key: https://aistudio.google.com/app/apikey
   - OpenAI API Key: https://platform.openai.com/api-keys

### Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your keys**
   ```bash
   # Edit with your favorite editor
   nano .env
   # or
   code .env
   ```

3. **Set required variables**
   ```env
   # These must be set for agents to work
   GOOGLE_API_KEY=sk-xxxxxxxxxxxx
   OPENAI_API_KEY=sk-xxxxxxxxxxxx

   # Optional: customize agent ports
   ORCHESTRATOR_PORT=9000
   COMPONENT_BUILDER_PORT=9001
   ITINERARY_PORT=9002
   ```

### Verify Installation

```bash
# Check uv is installed
uv --version

# Check Python version
python3 --version  # Should be 3.11+

# Check dependencies are installed
cd agents && uv sync
```

---

## ▶️ Running Agents

### Option 1: All-in-One (Recommended for Development)

```bash
pnpm dev
```

This starts:
- Next.js frontend on :3001
- Orchestrator agent on :9000
- Component builder agent on :9001

### Option 2: Individual Terminals (Better for Debugging)

**Terminal 1 - Frontend:**
```bash
pnpm dev:web
```

**Terminal 2 - Orchestrator:**
```bash
pnpm dev:orchestrator
```

**Terminal 3 - Component Builder:**
```bash
pnpm dev:components
```

### Option 3: Manual Python Execution

From the `agents/` directory:

```bash
# Activate virtual environment
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Run agent directly
python orchestrator.py
python component_builder_agent.py
```

### Check Agent Health

```bash
# Orchestrator health
curl http://localhost:9000/health

# Component builder health
curl http://localhost:9001/health

# Both should return JSON with status="healthy"
```

---

## 🧪 Testing Agent Communication

### 1. Open Frontend

Navigate to http://localhost:3001

You should see:
- CopilotKit chat interface
- Welcome message explaining available agents

### 2. Test Orchestrator

In the chat, try:
```
Hello! What can you do?
```

This should:
- Send message to orchestrator agent
- Orchestrator responds about its capabilities
- Response shows in chat

### 3. Test Component Generation

Try:
```
Generate a button component with TypeScript and shadcn/ui styling
```

This should:
- Orchestrator sends task to Component Builder agent
- Component Builder uses GPT-4 to generate code
- Code appears in chat with preview

### 4. Check Agent Communication

Open CopilotKit dev console (bottom-right of page in dev mode):
- See all messages sent to agents
- See responses and times
- Helpful for debugging

### 5. Test Direct Agent Endpoints

```bash
# Test component generation directly
curl -X POST http://localhost:9001/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate",
    "component_name": "ButtonComponent",
    "description": "A reusable button component",
    "type": "ui"
  }'
```

---

## 🐛 Troubleshooting

### Agent Won't Start

**Error**: `ModuleNotFoundError: No module named 'google.adk'`

**Solution**:
```bash
cd agents
uv sync
```

**Error**: `GOOGLE_API_KEY environment variable not set`

**Solution**:
```bash
export GOOGLE_API_KEY="your-key-here"
```

### Port Already in Use

**Error**: `Address already in use: :9000`

**Solution**:
```bash
# Find process using port
lsof -i :9000

# Kill it (replace PID with actual process ID)
kill -9 <PID>

# Or use different port in .env
ORCHESTRATOR_PORT=9005
```

### Frontend Can't Reach Agents

**Symptom**: Chat doesn't respond, console shows connection errors

**Check**:
1. Are agents running? 
   ```bash
   curl http://localhost:9000/health
   curl http://localhost:9001/health
   ```

2. Check `.env` has correct URLs:
   ```env
   ORCHESTRATOR_URL=http://localhost:9000
   COMPONENT_BUILDER_URL=http://localhost:9001
   ```

3. Check frontend `.env`:
   ```bash
   cat .env  # Should have agent URLs
   ```

### Agent Responds Slowly

**Cause**: First request to LLM takes time

**Solution**: Give agents 10-30 seconds on first request. Subsequent requests are faster.

**Check logs**:
- Terminal with agent should show request logs
- Look for "Starting..." and completion messages

### Python Version Mismatch

**Error**: `python3.11: command not found`

**Solution**:
```bash
# Use uv to manage Python version
uv python install 3.11

# Then sync again
cd agents && uv sync
```

---

## 🧩 Adding New A2A Agents

To create a new specialized agent (e.g., image generator, data analyzer):

### 1. Create Agent File

Create `agents/my_new_agent.py`:

```python
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.server.agent_execution import AgentExecutor, RequestContext

from utils.a2a_setup import create_agent_skill, create_agent_card

class MyAgentExecutor(AgentExecutor):
    async def execute(self, context: RequestContext, event_queue):
        # Your agent logic here
        result = {"status": "success", "data": "processed"}
        await event_queue.enqueue_event(str(result))
    
    async def cancel(self, context: RequestContext, event_queue):
        raise Exception("cancel not supported")

def main():
    port = int(os.getenv("MY_AGENT_PORT", "9002"))
    
    skill = create_agent_skill(
        skill_id="my_skill",
        name="My Skill",
        description="Does something awesome",
        tags=["awesome"],
        examples=["Do something"],
    )
    
    card = create_agent_card(
        name="My Agent",
        description="My awesome agent",
        url=f"http://localhost:{port}/",
        version="1.0.0",
        skills=[skill],
    )
    
    request_handler = DefaultRequestHandler(
        agent_executor=MyAgentExecutor(),
        task_store=InMemoryTaskStore(),
    )
    
    server = A2AStarletteApplication(
        agent_card=card,
        http_handler=request_handler,
        extended_agent_card=card,
    )
    
    print(f"🚀 Starting My Agent on http://localhost:{port}")
    uvicorn.run(server.build(), host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
```

### 2. Register in Frontend

Edit `/api/copilotkit/route.ts`:

```typescript
const myAgentUrl = process.env.MY_AGENT_URL || "http://localhost:9002";

const a2aMiddlewareAgent = new A2AMiddlewareAgent({
  agentUrls: [
    componentBuilderAgentUrl,
    myAgentUrl,  // Add your new agent
  ],
  orchestrationAgent,
});
```

### 3. Update Environment

Add to `.env`:

```env
MY_AGENT_URL=http://localhost:9002
MY_AGENT_PORT=9002
```

### 4. Add npm Script

Update `package.json`:

```json
{
  "scripts": {
    "dev:my-agent": "cd agents && uv sync && uv run my_new_agent.py"
  }
}
```

### 5. Test

```bash
# Run your new agent
pnpm dev:my-agent

# Chat should now be able to use it
```

---

## 📚 Learn More

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [AG-UI Protocol](https://docs.ag-ui.com/)
- [A2A Protocol](https://a2a-protocol.org/)
- [Google ADK](https://google.github.io/adk-docs/)
- [LangGraph](https://langchain.com/langgraph)

---

## ✅ Next Steps

1. ✅ Install dependencies and set up environment
2. ✅ Start all agents and frontend
3. ✅ Test agent communication in chat
4. ✅ Create custom agents for your use case
5. ✅ Deploy to production

Happy building! 🚀
