# Live Steam App - AI Agents Backend

This directory contains the Python-based AI agent backend for live-steam-app, featuring:

- **Orchestrator Agent** (Google ADK + Gemini 2.5 Pro + AG-UI Protocol)
- **Component Builder Agent** (OpenAI + LangGraph + A2A Protocol)
- **Extensible A2A agent framework** for adding new specialized agents

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- `uv` package manager ([install](https://astral.sh/uv/))
- API keys: Google (Gemini) and OpenAI

### Setup

1. **Create virtual environment and install dependencies:**

```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv sync
```

2. **Configure environment variables:**

```bash
cp .env.example .env
# Edit .env and add your API keys:
export GOOGLE_API_KEY="your-google-api-key"
export OPENAI_API_KEY="your-openai-api-key"
```

3. **Run agents:**

```bash
# Terminal 1: Orchestrator Agent (port 9000)
uv run orchestrator.py

# Terminal 2: Component Builder Agent (port 9001)
uv run component_builder_agent.py
```

### From Project Root

```bash
# Setup all agents
pnpm agents:setup

# Run all agents in parallel
pnpm dev:all

# Or individual agents:
pnpm dev:orchestrator
pnpm dev:components
```

## 📋 Architecture

### Protocol Triangle

```
┌─────────────────────────────────────┐
│  Frontend (React + CopilotKit)      │
└─────────────┬───────────────────────┘
              │
              ├─ AG-UI Protocol ─────┬─────────────────┐
              │                      │                 │
          ┌───▼────┐         ┌──────▼───┐      ┌─────▼────────┐
          │Orch.   │  A2A    │Component │      │ Other Agents │
          │Agent   │◄───────►│Builder   │      │              │
          │(ADK)   │Protocol │(LangGraph)     │              │
          └────────┘         └──────────┘      └──────────────┘
           :9000              :9001             :9002, :9003...
```

### Agent Types

1. **Orchestrator Agent**
   - Framework: Google ADK
   - Model: Gemini 2.5 Pro
   - Protocol: AG-UI (for frontend)
   - Role: Coordinates all specialized agents

2. **Component Builder Agent**
   - Framework: LangGraph
   - Model: OpenAI GPT-4o
   - Protocol: A2A (for agent-to-agent)
   - Role: Generates React components

3. **Extensible A2A Agents**
   - Can add more agents for specific domains
   - Each runs on its own port
   - Discoverable via A2A protocol

## 🔌 Adding New A2A Agents

To create a new specialized agent:

1. Create `agents/my_agent.py`
2. Implement `class MyAgentExecutor(AgentExecutor)`
3. Define agent skills and capabilities
4. Expose via A2A Protocol HTTP endpoint
5. Register URL in frontend config

Example skeleton:

```python
from a2a.server.agent_execution import AgentExecutor, RequestContext

class MyAgentExecutor(AgentExecutor):
    async def execute(self, context: RequestContext, event_queue):
        # Process request
        result = await self.process(context.message)
        # Send result back
        await event_queue.enqueue_event(result)
```

## 📚 Documentation

- [A2A Protocol Docs](https://a2a-protocol.org/)
- [AG-UI Docs](https://docs.ag-ui.com/)
- [Google ADK Docs](https://google.github.io/adk-docs/)
- [LangGraph Docs](https://langchain.com/langgraph)

## 🛠️ Development

### Testing Agents

```bash
# Test orchestrator endpoint
curl http://localhost:9000/health

# Test component builder
curl http://localhost:9001/health
```

### Debugging

Set debug mode in `.env`:

```bash
DEBUG=true
```

This enables verbose logging for all agents.

### Running Tests

```bash
uv run pytest
```

## 📦 Dependencies Management

Using `uv` for fast, deterministic Python dependency management:

```bash
# Add a new dependency
uv pip install package-name

# Update all dependencies
uv sync

# View dependency tree
uv pip list
```

## 🐛 Troubleshooting

**"Google ADK not installed"**
- Run: `uv sync`

**"GOOGLE_API_KEY not set"**
- Get key: https://aistudio.google.com/app/apikey
- Set: `export GOOGLE_API_KEY="your-key"`

**"OPENAI_API_KEY not set"**
- Get key: https://platform.openai.com/api-keys
- Set: `export OPENAI_API_KEY="your-key"`

**Agent won't start on port 9000/9001**
- Port may be in use: `lsof -i :9000`
- Kill process: `kill -9 <PID>`
- Or change port in `.env`

## 📖 Learn More

- [CopilotKit Docs](https://docs.copilotkit.ai/)
- [Full A2A Guide](https://docs.ag-ui.com/a2a)
