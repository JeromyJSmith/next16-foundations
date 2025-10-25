"""
Component Builder Agent - A2A Protocol + LangGraph

This agent specializes in:
1. Generating React components from specifications
2. Modifying existing components
3. Integrating shadcn/ui components
4. Creating TypeScript-first component code

It runs as an A2A Protocol server, making it discoverable and callable
by the orchestrator agent and other agents.
"""

import os
import json
import uvicorn
from typing import Optional, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# A2A Protocol imports (when available)
try:
    from a2a.server.apps import A2AStarletteApplication
    from a2a.server.request_handlers import DefaultRequestHandler
    from a2a.server.tasks import InMemoryTaskStore
    from a2a.server.agent_execution import AgentExecutor, RequestContext
    from a2a.types import AgentCapabilities, AgentCard, AgentSkill
    HAS_A2A = True
except ImportError:
    HAS_A2A = False
    print("⚠️  A2A Protocol not installed. Run 'uv sync' to install dependencies.")

# LLM imports
try:
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False
    print("⚠️  LangChain not installed. Run 'uv sync' to install dependencies.")

from utils.a2a_setup import create_agent_skill, create_agent_card, get_agent_urls


class ComponentBuilderAgent:
    """
    Main agent class for component generation using OpenAI + LangGraph.
    """
    
    def __init__(self):
        """Initialize the component builder agent."""
        if not HAS_LANGCHAIN:
            raise RuntimeError("LangChain not installed")
        
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
        )
    
    async def generate_component(
        self,
        component_name: str,
        description: str,
        component_type: str = "ui",
        shadcn_based: bool = True,
    ) -> dict[str, Any]:
        """
        Generate a React component based on specification.
        
        Args:
            component_name: Name of the component to generate
            description: Detailed description of what the component should do
            component_type: Type of component (ui, form, layout, etc.)
            shadcn_based: Whether to base it on shadcn/ui
            
        Returns:
            Generated component code and metadata
        """
        prompt = f"""
Generate a production-ready React component with the following specifications:

**Component Name**: {component_name}
**Type**: {component_type}
**Description**: {description}
**Base**: {"shadcn/ui components" if shadcn_based else "Custom React"}

Requirements:
1. Use TypeScript with full type safety
2. Export as named export
3. Include JSDoc comments
4. Use React 19 features (hooks, suspense)
5. Follow Next.js best practices
6. Include proper error handling
7. Make it responsive
8. Add accessibility features

Return ONLY valid TypeScript code, no markdown, no explanations.
Make sure the component is immediately usable.
        """
        
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            code = response.content.strip()
            
            # Clean up code if wrapped in markdown
            if "```tsx" in code:
                code = code.split("```tsx")[1].split("```")[0].strip()
            elif "```typescript" in code:
                code = code.split("```typescript")[1].split("```")[0].strip()
            
            return {
                "component_name": component_name,
                "code": code,
                "language": "typescript",
                "framework": "react",
                "type": component_type,
                "status": "success",
            }
        except Exception as e:
            return {
                "component_name": component_name,
                "error": str(e),
                "status": "error",
            }
    
    async def modify_component(
        self,
        component_code: str,
        modification_request: str,
    ) -> dict[str, Any]:
        """
        Modify an existing component based on a request.
        
        Args:
            component_code: Current component code
            modification_request: What needs to be changed
            
        Returns:
            Modified component code and metadata
        """
        prompt = f"""
Please modify the following React component based on this request:

**Current Component**:
```typescript
{component_code}
```

**Modification Request**: {modification_request}

Requirements:
1. Maintain TypeScript types
2. Preserve JSDoc comments
3. Keep the component's core functionality
4. Return ONLY the modified component code
5. No markdown, no explanations

Return the complete modified component:
        """
        
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            code = response.content.strip()
            
            # Clean up code if wrapped in markdown
            if "```tsx" in code:
                code = code.split("```tsx")[1].split("```")[0].strip()
            elif "```typescript" in code:
                code = code.split("```typescript")[1].split("```")[0].strip()
            
            return {
                "code": code,
                "language": "typescript",
                "modification_applied": modification_request,
                "status": "success",
            }
        except Exception as e:
            return {
                "error": str(e),
                "status": "error",
            }


class ComponentBuilderExecutor(AgentExecutor):
    """
    A2A Protocol executor that bridges the A2A Protocol with ComponentBuilderAgent.
    
    This class handles:
    - Receiving requests from other agents
    - Delegating to ComponentBuilderAgent
    - Sending results back via event queue
    """
    
    def __init__(self):
        """Initialize the executor with a ComponentBuilderAgent instance."""
        self.agent = ComponentBuilderAgent()
    
    async def execute(
        self,
        context: RequestContext,
        event_queue: Any,
    ) -> None:
        """
        Execute a component generation or modification request.
        
        Args:
            context: Request context containing the message
            event_queue: Queue for sending response events
        """
        try:
            # Parse the request message
            message_text = context.message.parts[0].root.text
            
            # Parse JSON request (expected format)
            request_data = json.loads(message_text)
            action = request_data.get("action", "generate")
            
            if action == "generate":
                result = await self.agent.generate_component(
                    component_name=request_data.get("component_name", "Component"),
                    description=request_data.get("description", ""),
                    component_type=request_data.get("type", "ui"),
                    shadcn_based=request_data.get("shadcn_based", True),
                )
            elif action == "modify":
                result = await self.agent.modify_component(
                    component_code=request_data.get("code", ""),
                    modification_request=request_data.get("request", ""),
                )
            else:
                result = {"error": f"Unknown action: {action}"}
            
            # Send result back through A2A event queue
            # (Implementation depends on A2A library version)
            await event_queue.enqueue_event(json.dumps(result))
            
        except Exception as e:
            error_result = {
                "error": str(e),
                "status": "error",
            }
            await event_queue.enqueue_event(json.dumps(error_result))
    
    async def cancel(
        self,
        context: RequestContext,
        event_queue: Any,
    ) -> None:
        """Handle cancellation requests."""
        raise Exception("cancel not supported")


def create_agent_card_for_component_builder(port: int) -> dict[str, Any]:
    """Create the A2A Agent Card for the component builder."""
    
    # Define skills this agent provides
    generate_skill = create_agent_skill(
        skill_id="generate_component",
        name="Generate React Component",
        description="Generates a new React component from specifications",
        tags=["react", "components", "shadcn/ui", "generation"],
        examples=[
            "Generate a button component",
            "Create a form component with validation",
            "Build a data table with sorting",
        ],
    )
    
    modify_skill = create_agent_skill(
        skill_id="modify_component",
        name="Modify React Component",
        description="Modifies an existing React component",
        tags=["react", "components", "modification"],
        examples=[
            "Add dark mode support to the button",
            "Make the form responsive",
            "Add loading state to the submit button",
        ],
    )
    
    # Create the public agent card
    return create_agent_card(
        name="Component Builder Agent",
        description="LangGraph + OpenAI agent that generates and modifies React components using shadcn/ui",
        url=f"http://localhost:{port}/",
        version="1.0.0",
        skills=[generate_skill, modify_skill],
        supports_streaming=True,
        supports_authentication=False,
    )


def main():
    """Main entry point for the component builder agent."""
    print("🔧 Setting up Component Builder Agent (LangGraph + A2A)...")
    
    # Check for required API key
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  Warning: OPENAI_API_KEY environment variable not set!")
        print("   Set it with: export OPENAI_API_KEY='your-key-here'")
        print("   Get a key from: https://platform.openai.com/api-keys")
        print()
    
    # Get port from environment
    port = int(os.getenv("COMPONENT_BUILDER_PORT", "9001"))
    
    if not HAS_A2A:
        raise RuntimeError("A2A Protocol not installed")
    
    try:
        print("📝 Creating Component Builder Agent...")
        
        # Create the agent card
        agent_card = create_agent_card_for_component_builder(port)
        
        # Create the A2A request handler
        print("🔌 Setting up A2A Protocol...")
        request_handler = DefaultRequestHandler(
            agent_executor=ComponentBuilderExecutor(),
            task_store=InMemoryTaskStore(),
        )
        
        # Create the A2A Starlette application
        server = A2AStarletteApplication(
            agent_card=agent_card,
            http_handler=request_handler,
            extended_agent_card=agent_card,
        )
        
        # Start the server
        print(f"✅ Starting Component Builder Agent on http://localhost:{port}")
        print(f"   A2A Protocol endpoint: http://localhost:{port}/")
        print()
        print("Agent is ready to receive requests from orchestrator!")
        print()
        
        uvicorn.run(server.build(), host="0.0.0.0", port=port, log_level="info")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure you have:")
        print("  1. Run 'uv sync' to install dependencies")
        print("  2. Set OPENAI_API_KEY environment variable")
        raise


if __name__ == "__main__":
    main()
