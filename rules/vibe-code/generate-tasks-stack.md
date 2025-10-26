---

alwaysApply: false

description: How to generate a task list from a PRD for Next.js 16 + Turborepo + pnpm + next16-foundations monorepo

---

# Rule: Generating a Task List from a PRD

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD). The task list should guide a developer through implementation in a **Next.js 16.0.1 + Turborepo + pnpm + tRPC + Drizzle ORM + shadcn/ui + TailwindCSS + Python Agent Orchestration + Biome + Tauri** monorepo environment (next16-foundations).

## Stack Annotation

All task lists generated must reference the following stack:

**Next.js 16.0.1, pnpm, Turborepo, Biome, Drizzle ORM, tRPC, shadcn/ui, TailwindCSS, Tauri, Python Agent Orchestration**

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/tasks/`
- **Filename:** `tasks-[prd-file-name].md` (e.g., `tasks-0001-prd-user-profile-editing.md`)

## Process

1. **Receive PRD Reference:** The user points the AI to a specific PRD file.

2. **Analyze PRD:** The AI reads and analyzes the functional requirements, user stories, technical considerations, agent workflow considerations, and other sections of the specified PRD.

3. **Assess Current State:** Review the existing monorepo codebase to understand:
   * Existing workspace structure (`apps/web`, `packages/*`, `/agents`)
   * Architectural patterns and conventions
   * Shared packages (`@live-steam-app/api`, `@live-steam-app/db`, etc.)
   * Existing components, utilities, and API routes that can be leveraged
   * Database schema (Drizzle tables) and authentication setup
   * Turborepo task dependencies and build configuration
   * Python agent orchestration structure in `/agents`
   * Tauri desktop build configuration
   * PWA configuration and service workers

4. **Phase 1: Generate Parent Tasks:** Based on the PRD analysis and current state assessment, create the file and generate the main, high-level tasks required to implement the feature. Use your judgment on how many high-level tasks to use (typically 4-6 tasks). Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."

5. **Wait for Confirmation:** Pause and wait for the user to respond with "Go".

6. **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks:
   * Logically follow from the parent task
   * Cover implementation details implied by the PRD
   * Consider existing codebase patterns and monorepo structure
   * Specify which workspace packages are affected
   * Include test coverage requirements
   * Follow Turborepo build dependencies
   * **Include script/test updates:** All changes must run `pnpm build`, `pnpm biome`, `pnpm check-types`, and corresponding DB/test scripts per change
   * **For agent features:** Sub-tasks must specify agent orchestration folder, Python logic, and TypeScript communication contract updates in `/packages/types` or `/agents/schemas`
   * **Workspace validation:** Confirm every new feature and package is added to the root-level `package.json` in the `workspaces` array
   * **Desktop/PWA:** If app assets, service workers, or Tauri build scripts are affected, list all files and update instructions

7. **Identify Relevant Files:** Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the `Relevant Files` section, including:
   * Application files (`apps/web/`)
   * Shared package files (`packages/*/src/`)
   * Database schema files (`packages/db/schema/`)
   * API route files (`packages/api/routers/`)
   * **Python agent files:** All Python files must live in `/agents` and have docstring comments referencing agent communication model
   * Test files (`.test.ts`, `.test.tsx`)
   * Configuration files (`turbo.json`, `tsconfig.json`, etc.)
   * Tauri configuration (`apps/web/src-tauri/tauri.conf.json`)
   * **README and API documentation:** Required for any tRPC or Drizzle changes, plus usage and approval queue flows

8. **Generate Final Output:** Combine the parent tasks, sub-tasks, relevant files, and notes into the final Markdown structure.

9. **Save Task List:** Save the generated document in the `/tasks/` directory with the filename `tasks-[prd-file-name].md`, where `[prd-file-name]` matches the base name of the input PRD file.

## Output Format

The generated task list _must_ follow this structure:

```markdown

## Relevant Files

### Application Files
- `apps/web/app/[route]/page.tsx` - Main page component for the feature
- `apps/web/app/[route]/page.test.tsx` - Unit tests for page component
- `apps/web/components/FeatureComponent.tsx` - Feature-specific component
- `apps/web/components/FeatureComponent.test.tsx` - Component tests

### Shared Packages
- `packages/ui/src/components/NewButton.tsx` - New component using shadcn/ui
- `packages/ui/src/components/NewButton.test.tsx` - Button component tests
- `packages/api/src/routers/feature.ts` - tRPC router for feature endpoints
- `packages/api/src/routers/feature.test.ts` - API route tests
- `packages/db/schema/feature.ts` - Drizzle schema for feature
- `packages/types/src/feature.ts` - Shared TypeScript types

### Python Agent Files (if applicable)
- `/agents/orchestrator.py` - Agent orchestration logic
- `/agents/component_builder_agent.py` - Component builder agent
- `/agents/schemas/feature_schema.py` - Agent communication schema
- `/agents/tests/test_feature.py` - Python agent tests

### Configuration & Documentation
- `turbo.json` - Update task dependencies if needed
- `packages/typescript-config/base.json` - TypeScript configuration updates if needed
- `apps/web/src-tauri/tauri.conf.json` - Tauri desktop configuration (if applicable)
- `README.md` - Usage documentation for tRPC/Drizzle changes
- `docs/agent-workflows.md` - Agent approval queue documentation

## Notes

### Testing Strategy
- Unit tests should be co-located with source files (e.g., `Component.tsx` and `Component.test.tsx` in same directory)
- Run tests with `pnpm test [optional/path]` or `pnpm test --watch` for watch mode
- Integration tests go in `__tests__/integration/` directory
- **Agent tests:** Python agent tests go in `/agents/tests/`
- Run full test suite before marking parent tasks complete

### Workspace Commands
- `pnpm dev` - Start development server for all apps
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run all tests across workspace
- `pnpm biome` or `pnpm check` - Lint and format all packages (Biome only)
- `pnpm check-types` - TypeScript validation
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:push` - Apply Drizzle migrations
- `pnpm dev:agents` - Start Python agent orchestration
- `pnpm desktop:dev` - Start Tauri desktop app in dev mode

### Stack-Specific Notes
- **Next.js 16:** Leverage Cache Components, Turbopack, React Server Components, and async request APIs
- **tRPC:** Define type-safe API routes with Zod schemas for input validation
- **Drizzle:** Create migrations with `pnpm db:generate` and apply with `pnpm db:push`
- **shadcn/ui + Tailwind:** Use shadcn/ui components and Tailwind utility classes
- **Biome:** Official formatting/linting tool (no ESLint/Prettier)
- **Agent Orchestration:** Python logic in `/agents`, TypeScript contracts in `/packages/types` or `/agents/schemas`
- **Tauri Desktop:** Cross-platform desktop builds, configuration in `apps/web/src-tauri/`
- **Type Safety:** Never duplicate agent logic between `/agents` (Python), `/packages/api` (tRPC), `/apps/web` (frontend); always validate API contract and type sharing

## Tasks

- [ ] 1.0 Setup Workspace Structure
  - [ ] 1.1 Create new workspace package if needed (`packages/feature-name/`)
  - [ ] 1.2 Update workspace dependencies in `package.json` files
  - [ ] 1.3 Configure TypeScript paths and exports
  - [ ] 1.4 Update Turborepo task dependencies in `turbo.json`
  - [ ] 1.5 Add new package to root `package.json` workspaces array

- [ ] 2.0 Database Schema & Migrations
  - [ ] 2.1 Define Drizzle schema in `packages/db/schema/feature.ts`
  - [ ] 2.2 Generate migration with `pnpm db:generate`
  - [ ] 2.3 Review and apply migration with `pnpm db:push`
  - [ ] 2.4 Create database seed data if needed
  - [ ] 2.5 Update README with schema documentation

- [ ] 3.0 API Layer (tRPC)
  - [ ] 3.1 Create tRPC router in `packages/api/src/routers/feature.ts`
  - [ ] 3.2 Define input/output schemas with Zod
  - [ ] 3.3 Implement business logic and database queries
  - [ ] 3.4 Add authorization checks if needed
  - [ ] 3.5 Write API integration tests
  - [ ] 3.6 Update API documentation in README

- [ ] 4.0 Python Agent Orchestration (if applicable)
  - [ ] 4.1 Define agent communication contract in `/agents/schemas/`
  - [ ] 4.2 Implement Python agent logic in `/agents/`
  - [ ] 4.3 Update TypeScript types in `/packages/types/`
  - [ ] 4.4 Create integration tests for agent API communication
  - [ ] 4.5 Document approval workflow and agent usage
  - [ ] 4.6 Validate agent integration with tRPC endpoints

- [ ] 5.0 UI Components (shadcn/ui + Tailwind)
  - [ ] 5.1 Create shared components in `packages/ui/` if needed
  - [ ] 5.2 Build feature-specific components in `apps/web/components/`
  - [ ] 5.3 Implement using shadcn/ui components and Tailwind utilities
  - [ ] 5.4 Add component unit tests
  - [ ] 5.5 Ensure accessibility (a11y) compliance

- [ ] 6.0 Desktop/PWA Integration (if applicable)
  - [ ] 6.1 Update Tauri configuration in `apps/web/src-tauri/tauri.conf.json`
  - [ ] 6.2 Implement desktop-specific features or permissions
  - [ ] 6.3 Update service worker for PWA offline support
  - [ ] 6.4 Test cross-platform compatibility (Windows, macOS, Linux)
  - [ ] 6.5 Document desktop build instructions

- [ ] 7.0 Integration & Testing
  - [ ] 7.1 Write integration tests for full user flows
  - [ ] 7.2 Test across different viewport sizes
  - [ ] 7.3 Validate form submissions and error handling
  - [ ] 7.4 Run full test suite (`pnpm test`)
  - [ ] 7.5 Run type checking (`pnpm check-types`)
  - [ ] 7.6 Run Biome linting (`pnpm biome` or `pnpm check`)
  - [ ] 7.7 Validate Turborepo build graph

- [ ] 8.0 Documentation & Cleanup
  - [ ] 8.1 Update relevant README files
  - [ ] 8.2 Add JSDoc comments to public APIs
  - [ ] 8.3 Document agent workflows and approval queues (if applicable)
  - [ ] 8.4 Remove temporary code and console logs
  - [ ] 8.5 Run final linting and formatting (`pnpm biome`)

```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations and monorepo structure before diving into implementation details.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature with awareness of:
* The existing monorepo structure (next16-foundations)
* Turborepo conventions and build dependencies
* Next.js 16 features and patterns (Cache Components, Turbopack, async APIs)
* tRPC, Drizzle ORM, shadcn/ui, TailwindCSS
* Python agent orchestration in `/agents`
* Tauri desktop build workflows
* Testing requirements and strategies

## Stack-Specific Considerations

When generating tasks, always account for:

* **Workspace isolation:** Tasks should respect package boundaries and use `workspace:*` protocol
* **Type safety:** All data flows should be type-safe from database to UI, including agent communication contracts
* **Testing pyramid:** Unit tests → Integration tests → E2E tests (including agent tests)
* **Build order:** Respect Turborepo task dependencies
* **Shared abstractions:** Identify opportunities to create reusable packages
* **Performance:** Consider Next.js 16 Cache Components, Turbopack, and React Server Components
* **Agent integration:** Validate API contracts between Python agents and TypeScript packages
* **Desktop/PWA:** Cross-platform compatibility, service workers, offline support
* **Developer experience:** Include commands for local development, testing, and agent orchestration
* **Biome-only formatting:** No ESLint/Prettier references; use Biome exclusively
* **pnpm commands:** All commands use `pnpm`, never `bun` or `npm`
