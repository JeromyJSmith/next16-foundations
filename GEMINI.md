# Project Overview

This project is a monorepo built with the Better-T-Stack, designed for a live streaming application. It integrates a Next.js frontend, a tRPC API, a Drizzle ORM-based database layer, and Python-based AI agents. The monorepo is managed by Turborepo, ensuring efficient build and development workflows.

# Technologies Used

*   **Frontend:** Next.js (v16.0.1-canary.2), React (v19.2.0), TailwindCSS, shadcn/ui, PWA.
*   **Backend (API):** tRPC, TypeScript.
*   **Database:** PostgreSQL, Drizzle ORM, TypeScript.
*   **AI Agents:** Python 3.11+, Google ADK, LangChain, LangGraph, FastAPI, Uvicorn.
*   **Monorepo Management:** Turborepo.
*   **Package Management:** pnpm (JavaScript/TypeScript), uv (Python).
*   **Code Quality:** Biome (linting and formatting), Husky (git hooks).
*   **Desktop Application:** Tauri.
*   **Realtime:** Supabase Realtime.
*   **AI/Copilot Integration:** @copilotkit/react-core, @ai-sdk/openai, @anthropic-ai/sdk, @modelcontextprotocol/sdk.

# Project Structure

The project follows a monorepo structure:

*   `apps/web`: The main Next.js full-stack application, including Tauri for desktop builds and PWA support.
*   `apps/docs`: Documentation application (Astro-based).
*   `packages/api`: The tRPC API layer, handling business logic.
*   `packages/db`: The database layer, utilizing Drizzle ORM for PostgreSQL.
*   `agents`: Contains Python-based AI agents (orchestrator, component builder, and specialized agents) using FastAPI.

# Getting Started

## Prerequisites

*   Node.js (LTS recommended)
*   pnpm
*   Python 3.11+
*   uv (Python package manager)
*   PostgreSQL database

## Installation

1.  **Install JavaScript/TypeScript dependencies:**
    ```bash
    pnpm install
    ```
2.  **Setup Python virtual environment and dependencies for agents:**
    ```bash
    cd agents && uv venv && uv sync
    ```

## Database Setup

1.  Ensure you have a PostgreSQL database running.
2.  Update your `apps/web/.env` file with your PostgreSQL connection details.
3.  Apply the database schema:
    ```bash
    pnpm db:push
    ```

## Running the Development Servers

*   **Start all applications (web, API, agents):**
    ```bash
    pnpm dev
    ```
*   **Start web app only:**
    ```bash
    pnpm dev:web
    ```
*   **Start Python agents only:**
    ```bash
    pnpm dev:agents
    ```
*   **Start Tauri desktop app in development mode:**
    ```bash
    cd apps/web && pnpm desktop:dev
    ```

## Building the Project

*   **Build all applications:**
    ```bash
    pnpm build
    ```
*   **Build Tauri desktop app:**
    ```bash
    cd apps/web && pnpm desktop:build
    ```

## Running Tests

*   **Run Python agent tests:**
    ```bash
    cd agents && uv run pytest
    ```

## Code Quality

*   **Run Biome checks (formatting and linting):**
    ```bash
    pnpm check
    ```
*   **Check TypeScript types:**
    ```bash
    pnpm check-types
    ```

# Development Conventions

*   **Monorepo:** Managed with Turborepo.
*   **Package Managers:** `pnpm` for JS/TS, `uv` for Python.
*   **Code Formatting & Linting:** Enforced with Biome and Husky pre-commit hooks.
*   **TypeScript:** Used extensively for type safety.
*   **API Communication:** tRPC for end-to-end type-safe APIs.
*   **Database ORM:** Drizzle for database interactions.
*   **AI Agents:** Python-based agents using Google ADK, LangChain, and FastAPI.

# Additional Notes

*   The Next.js application utilizes experimental caching features and a custom `cacheLife` configuration, including specific settings for "agents".
*   The project integrates various AI/Copilot related libraries, suggesting a strong focus on AI-assisted development and agent-to-agent (A2A) communication.
