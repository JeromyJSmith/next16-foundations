"""
A2A Protocol Setup Utilities

This module provides helper functions for setting up A2A (Agent-to-Agent) Protocol
communication between agents, enabling inter-agent collaboration.
"""

from typing import Optional, Any
import os


def setup_a2a_environment() -> dict[str, Any]:
    """
    Set up and validate A2A environment variables.
    
    Returns:
        Dictionary with A2A configuration
    """
    config = {
        "component_builder_url": os.getenv("COMPONENT_BUILDER_URL", "http://localhost:9001"),
        "component_builder_port": int(os.getenv("COMPONENT_BUILDER_PORT", "9001")),
        "itinerary_url": os.getenv("ITINERARY_AGENT_URL", "http://localhost:9002"),
        "itinerary_port": int(os.getenv("ITINERARY_PORT", "9002")),
        "debug": os.getenv("DEBUG", "false").lower() == "true",
    }
    
    return config


def create_agent_skill(
    skill_id: str,
    name: str,
    description: str,
    tags: list[str],
    examples: list[str],
) -> dict[str, Any]:
    """
    Create an A2A Agent Skill definition.
    
    Args:
        skill_id: Unique identifier for the skill
        name: Human-readable skill name
        description: What the skill does
        tags: Skill tags for discovery
        examples: Example usage
        
    Returns:
        Agent Skill dictionary
    """
    return {
        "id": skill_id,
        "name": name,
        "description": description,
        "tags": tags,
        "examples": examples,
    }


def create_agent_card(
    name: str,
    description: str,
    url: str,
    version: str,
    skills: list[dict],
    supports_streaming: bool = True,
    supports_authentication: bool = False,
) -> dict[str, Any]:
    """
    Create an A2A Agent Card (public agent discovery information).
    
    Args:
        name: Agent name
        description: Agent description
        url: Agent HTTP endpoint URL
        version: Agent version
        skills: List of agent skills
        supports_streaming: Whether agent supports streaming responses
        supports_authentication: Whether agent requires authentication
        
    Returns:
        Agent Card dictionary
    """
    return {
        "name": name,
        "description": description,
        "url": url,
        "version": version,
        "defaultInputModes": ["text"],
        "defaultOutputModes": ["text"],
        "capabilities": {
            "streaming": supports_streaming,
        },
        "skills": skills,
        "supportsAuthenticatedExtendedCard": supports_authentication,
    }


def get_agent_urls() -> dict[str, str]:
    """Get all agent URLs from environment."""
    return {
        "component_builder": os.getenv("COMPONENT_BUILDER_URL", "http://localhost:9001"),
        "itinerary": os.getenv("ITINERARY_AGENT_URL", "http://localhost:9002"),
    }
