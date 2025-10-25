"""
AG-UI Protocol Setup Utilities

This module provides helper functions for setting up AG-UI Protocol integration
with Google ADK agents, enabling communication between agents and frontend.
"""

from typing import Optional, Any
import os


def setup_ag_ui_environment() -> dict[str, Any]:
    """
    Set up and validate AG-UI environment variables.
    
    Returns:
        Dictionary with AG-UI configuration
        
    Raises:
        ValueError: If required environment variables are missing
    """
    config = {
        "orchestrator_url": os.getenv("ORCHESTRATOR_URL", "http://localhost:9000"),
        "orchestrator_port": int(os.getenv("ORCHESTRATOR_PORT", "9000")),
        "debug": os.getenv("DEBUG", "false").lower() == "true",
        "session_timeout": int(os.getenv("SESSION_TIMEOUT_SECONDS", "3600")),
        "use_in_memory": os.getenv("USE_IN_MEMORY_STORAGE", "true").lower() == "true",
    }
    
    return config


def create_ag_ui_agent_config(
    app_name: str,
    user_id: str = "demo_user",
    session_timeout: int = 3600,
    use_in_memory: bool = True,
) -> dict[str, Any]:
    """
    Create AG-UI agent configuration dictionary.
    
    Args:
        app_name: Unique application identifier
        user_id: User ID for the session
        session_timeout: Session timeout in seconds
        use_in_memory: Use in-memory storage
        
    Returns:
        AG-UI agent configuration dictionary
    """
    return {
        "app_name": app_name,
        "user_id": user_id,
        "session_timeout_seconds": session_timeout,
        "use_in_memory_services": use_in_memory,
    }


def get_orchestrator_url() -> str:
    """Get orchestrator URL from environment."""
    return os.getenv("ORCHESTRATOR_URL", "http://localhost:9000")
