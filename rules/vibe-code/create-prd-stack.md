---

alwaysApply: false

description: How to generate a PRD for Next.js 16 + Turborepo + pnpm + next16-foundations stack

---

# Rule: Generating a Product Requirements Document (PRD)

## Goal

To guide an AI assistant in creating a detailed Product Requirements Document (PRD) in Markdown format, based on an initial user prompt. The PRD should be clear, actionable, and suitable for a junior developer to understand and implement the feature within a **Next.js 16.0.1 + Turborepo + pnpm + tRPC + Drizzle ORM + shadcn/ui + Python Agent Orchestration** monorepo (next16-foundations).

## Process

1. **Receive Initial Prompt:** The user provides a brief description or request for a new feature or functionality.

2. **Ask Clarifying Questions:** Before writing the PRD, the AI *must* ask clarifying questions to gather sufficient detail. The goal is to understand the "what" and "why" of the feature, not necessarily the "how" (which the developer will figure out). Make sure to provide options in letter/number lists so I can respond easily with my selections.

3. **Generate PRD:** Based on the initial prompt and the user's answers to the clarifying questions, generate a PRD using the structure outlined below.

4. **Save PRD:** Save the generated document as `[n]-prd-[feature-name].md` inside the `/tasks` directory. (Where `n` is a zero-padded 4-digit sequence starting from 0001, e.g., `0001-prd-user-authentication.md`, `0002-prd-dashboard.md`, etc.)

## Clarifying Questions (Examples)

The AI should adapt its questions based on the prompt, but here are some common areas to explore:

* **Problem/Goal:** "What problem does this feature solve for the user?" or "What is the main goal we want to achieve with this feature?"

* **Target User:** "Who is the primary user of this feature?"

* **Core Functionality:** "Can you describe the key actions a user should be able to perform with this feature?"

* **User Stories:** "Could you provide a few user stories? (e.g., As a [type of user], I want to [perform an action] so that [benefit].)"

* **Acceptance Criteria:** "How will we know when this feature is successfully implemented? What are the key success criteria?"

* **Scope/Boundaries:** "Are there any specific things this feature *should not* do (non-goals)?"

* **Data Requirements:** "What kind of data does this feature need to display or manipulate?"

* **Design/UI:** "Are there any existing design mockups or UI guidelines to follow?" or "Can you describe the desired look and feel?" or "Should this use components from shadcn/ui or TailwindCSS utilities?"

* **Edge Cases:** "Are there any potential edge cases or error conditions we should consider?"

* **Workspace Context:** "Which app(s) in the monorepo will this feature live in? (`apps/web`, `/agents` for Python orchestration, etc.)" or "Will this require creating new shared packages?"

* **API/Backend:** "Does this feature require new API endpoints (tRPC routes)?" or "Will it interact with the database (Drizzle ORM)?"

* **Authentication/Authorization:** "Does this feature require authentication?" or "Are there specific permissions or roles needed?"

* **Agent Orchestration:** "Does this feature involve Python-based agent orchestration (`/agents`)?" or "Will this require approval queue integration or agent communication contracts?"

* **Desktop/PWA:** "Does this feature require Tauri desktop build modifications?" or "Are there PWA-specific requirements (service workers, offline capabilities)?"

## PRD Structure

The generated PRD should include the following sections:

1. **Introduction/Overview:** Briefly describe the feature and the problem it solves. State the goal.

2. **Goals:** List the specific, measurable objectives for this feature.

3. **User Stories:** Detail the user narratives describing feature usage and benefits.

4. **Functional Requirements:** List the specific functionalities the feature must have. Use clear, concise language (e.g., "The system must allow users to upload a profile picture."). Number these requirements.
   * **Database Requirements:** All functional requirements must acknowledge Drizzle ORM models and migration protocol via `pnpm db:generate` and `pnpm db:push`, not direct SQL or anonymous schema changes.

5. **Non-Goals (Out of Scope):** Clearly state what this feature will *not* include to manage scope.

6. **Design Considerations (Optional):** Link to mockups, describe UI/UX requirements, or mention relevant components/styles if applicable. 
   * **Design System Usage:** Always specify if shadcn/ui components and Tailwind utility tokens/classes are required.
   * Reference component library usage patterns from shadcn/ui.

7. **Agent Workflow Considerations (if applicable):**
   * If feature impacts agent orchestrator (Python in `/agents`), detail:
     - Communication contract (API schema, type definitions)
     - Approval queue integration for `/agents`
     - Agent response patterns and error handling
     - Coordination between `/agents` (Python) and `/packages/api` (tRPC)

8. **Technical Considerations:** 
   * Mention any known technical constraints, dependencies, or suggestions
   * Specify which workspace packages will be affected (`@live-steam-app/api`, `@live-steam-app/db`, etc.)
   * Note if new shared packages need to be created
   * Identify required API endpoints (tRPC routes in `/packages/api`)
   * Specify database schema changes (Drizzle migrations via `pnpm db:generate`)
   * Note authentication/authorization requirements
   * Identify Next.js 16 specific features to leverage (Cache Components, Turbopack, React Server Components, etc.)
   * **Desktop/PWA Requirements:** If Tauri desktop build workflows or Next PWA configs require modification, specify:
     - Tauri configuration changes (`apps/web/src-tauri/`)
     - Service worker updates for PWA
     - Cross-platform compatibility requirements
     - Desktop-specific features or permissions

9. **Success Metrics:** How will the success of this feature be measured? (e.g., "Increase user engagement by 10%", "Reduce support tickets related to X").

10. **Testing Requirements:**
    * Specify required unit tests
    * Identify integration test scenarios
    * Note any E2E test requirements
    * List acceptance test criteria
    * **Agent testing:** If agents are involved, specify agent integration tests and approval workflow validation

11. **Open Questions:** List any remaining questions or areas needing further clarification.

## Monorepo-Specific Considerations (next16-foundations)

When generating PRDs for this stack, always consider:

* **Workspace Structure:** 
  - Identify which apps (`apps/web`) and packages (`packages/*`) will be affected
  - If Python agent orchestration is involved, specify `/agents` folder structure
  - Ensure new features/packages are added to root-level `package.json` in the `workspaces` array

* **Shared Logic:** Determine if functionality should be abstracted into shared packages

* **API Design:** Define tRPC procedures and input/output schemas with Zod validation

* **Database Schema:** Specify Drizzle table definitions and relationships, migrations via `pnpm db:generate`

* **Type Safety:** Ensure all interfaces and types are properly defined and shared via `/packages/types` or `/agents/schemas` for agent contracts

* **Build Dependencies:** Consider Turborepo task dependencies and build order in `turbo.json`

* **Testing Strategy:** Define test coverage expectations across workspace packages using appropriate test runners

* **Agent Communication:** 
  - All Python files must live in `/agents` and have docstring comments referencing agent communication model
  - Type definitions and API contracts must be shared in `/packages/types` or `/agents/schemas`
  - Approval queue and task integration must be documented

* **README and API Documentation:** For any tRPC or Drizzle changes, include usage documentation and approval queue flows

## Target Audience

Assume the primary reader of the PRD is a **junior developer** working in a production-grade monorepo. Therefore, requirements should be explicit, unambiguous, and avoid jargon where possible. Provide enough detail for them to understand:

* The feature's purpose and core logic
* Where in the monorepo structure the code should live (`apps/web`, `/agents`, `packages/*`)
* Which shared packages to use or create
* How the feature integrates with existing infrastructure (tRPC, Drizzle, agent orchestration)
* Any desktop/PWA-specific considerations

## Output

* **Format:** Markdown (`.md`)
* **Location:** `/tasks/`
* **Filename:** `[n]-prd-[feature-name].md`

## Final Instructions

1. Do NOT start implementing the PRD
2. Make sure to ask the user clarifying questions with clear options
3. Take the user's answers to the clarifying questions and improve the PRD
4. Ensure the PRD clearly specifies monorepo workspace structure and package dependencies
5. Include technical considerations specific to Next.js 16, Turborepo, pnpm, tRPC, Drizzle ORM, shadcn/ui, Biome, agent orchestration, and Tauri desktop
6. All commands must use `pnpm`, not `bun` or `npm`
7. All formatting/linting references must use Biome (`pnpm biome`, `pnpm check`)
8. Agent orchestration PRDs must detail Python logic in `/agents` and TypeScript communication contracts
