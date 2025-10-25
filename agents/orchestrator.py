"""
Orchestrator Agent - Google ADK + AG-UI Protocol

This is the main orchestrator agent that:
1. Uses Google ADK with Gemini 2.5 Pro as the LLM
2. Wraps with AG-UI Protocol for frontend communication
3. Orchestrates calls to specialized A2A agents
4. Exposes itself as an HTTP endpoint via FastAPI

The orchestrator acts as the "project manager" that coordinates between
the user (via frontend) and specialized agents (via A2A).
"""

import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Google ADK imports (when available)
try:
    from google.adk.agents import LlmAgent
    from ag_ui_adk import ADKAgent
    from ag_ui_adk.fastapi import add_adk_fastapi_endpoint
    HAS_GOOGLE_ADK = True
except ImportError:
    HAS_GOOGLE_ADK = False
    print("⚠️  Google ADK not installed. Run 'uv sync' to install dependencies.")

from fastapi import FastAPI
from utils.ag_ui_setup import setup_ag_ui_environment, create_ag_ui_agent_config
from utils.a2a_setup import setup_a2a_environment


def create_orchestrator_agent():
    """
    Create the orchestrator agent using Google ADK + AG-UI Protocol.
    
    The orchestrator coordinates:
    - Component Builder Agent (A2A): Generates React components
    - Itinerary Agent (A2A/LangGraph): Creates travel plans
    - Other specialized agents
    """
    if not HAS_GOOGLE_ADK:
        raise RuntimeError("Google ADK not installed")
    
    # Configure the orchestrator LLM agent
    orchestrator_agent = LlmAgent(
        name="OrchestratorAgent",
        model="gemini-2.5-pro",  # Use the powerful Gemini model
        instruction="""
You are an AI orchestrator agent for live-stream-app. Your role is to coordinate 
specialized agents to help users create components, generate content, and manage workflows.

AVAILABLE SPECIALIZED AGENTS:
1. **Component Builder Agent** (A2A) - Generates and modifies React components
2. **Itinerary Agent** (A2A) - Creates structured itineraries and plans

CRITICAL CONSTRAINTS:
- You MUST call agents ONE AT A TIME, never make multiple tool calls simultaneously
- After making a tool call, WAIT for the result before making another tool call
- Do NOT make parallel/concurrent tool calls

WORKFLOW:
1. Understand the user's request
2. Identify which agent(s) are needed
3. Call agents sequentially with clear instructions
4. Aggregate results
5. Present a comprehensive response to the user

ALWAYS:
- Be helpful and proactive
- Explain what you're doing
- Handle errors gracefully
- Ask for clarification if needed
        """,
    )
    
    return orchestrator_agent


def create_ag_ui_wrapped_agent(adk_agent):
    """Wrap the orchestrator agent with AG-UI Protocol capabilities."""
    if not HAS_GOOGLE_ADK:
        raise RuntimeError("Google ADK not installed")
    
    ag_ui_config = create_ag_ui_agent_config(
        app_name="orchestrator_app",
        user_id="demo_user",
        session_timeout=3600,
        use_in_memory=True,
    )
    
    adk_orchestrator = ADKAgent(
        adk_agent=adk_agent,
        **ag_ui_config,
    )
    
    return adk_orchestrator


def create_fastapi_app(adk_orchestrator_agent):
    """Create the FastAPI application with AG-UI endpoint."""
    app = FastAPI(
        title="Orchestrator Agent (ADK + AG-UI)",
        description="Main orchestrator agent for live-steam-app",
        version="0.1.0",
    )
    
    # Add AG-UI Protocol endpoint
    add_adk_fastapi_endpoint(app, adk_orchestrator_agent, path="/")
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "agent": "orchestrator",
            "protocol": "AG-UI",
        }
    
    return app


def main():
    """Main entry point for the orchestrator agent."""
    # Validate environment
    print("🔧 Setting up Orchestrator Agent (ADK + AG-UI Protocol)...")
    
    # Check for required API key
    if not os.getenv("GOOGLE_API_KEY"):
        print("⚠️  Warning: GOOGLE_API_KEY environment variable not set!")
        print("   Set it with: export GOOGLE_API_KEY='your-key-here'")
        print("   Get a key from: https://aistudio.google.com/app/apikey")
        print()
    
    # Get configuration
    ag_ui_config = setup_ag_ui_environment()
    a2a_config = setup_a2a_environment()
    
    port = ag_ui_config["orchestrator_port"]
    
    try:
        # Create the orchestrator agent
        print("📝 Creating Orchestrator Agent with Gemini 2.5 Pro...")
        orchestrator_agent = create_orchestrator_agent()
        
        # Wrap with AG-UI Protocol
        print("🔌 Wrapping agent with AG-UI Protocol...")
        adk_orchestrator = create_ag_ui_wrapped_agent(orchestrator_agent)
        
        # Create FastAPI app
        print("🚀 Creating FastAPI application...")
        app = create_fastapi_app(adk_orchestrator)
        
        # Start server
        print(f"✅ Starting Orchestrator Agent on http://localhost:{port}")
        print(f"   AG-UI Protocol endpoint: http://localhost:{port}/")
        print(f"   Health check: http://localhost:{port}/health")
        print()
        print("Agent is ready to receive requests from frontend!")
        print()
        
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure you have:")
        print("  1. Run 'uv sync' to install dependencies")
        print("  2. Set GOOGLE_API_KEY environment variable")
        raise


if __name__ == "__main__":
    main()
