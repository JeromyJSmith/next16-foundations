---

alwaysApply: false

description: How to process a task list in a Next.js 16 + Turborepo + pnpm + next16-foundations monorepo

---

# Task List Management for next16-foundations Monorepo

Guidelines for managing task lists in markdown files to track progress on completing a PRD in a **Next.js 16.0.1 + Turborepo + pnpm + tRPC + Drizzle ORM + shadcn/ui + TailwindCSS + Python Agent Orchestration + Biome + Tauri** environment (next16-foundations).

## Task Implementation

- **One sub-task at a time:** Do **NOT** start the next sub-task until you ask the user for permission and they say "yes" or "y"

- **Completion protocol:**

1. When you finish a **sub-task**, immediately mark it as completed by changing `[ ]` to `[x]`.

2. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:

   - **First**: Run the appropriate test suite:
     * `pnpm test` - Run all tests across workspace
     * `pnpm test [path]` - Run specific test file or directory
     * `pnpm test --watch` - Run tests in watch mode
     * `pnpm agents:test` - Run Python agent tests (if applicable)
   
   - **Validate workspace integrity**:
     * `pnpm check-types` - TypeScript validation across all packages
     * `pnpm biome` or `pnpm check` - Run Biome linting and formatting (ONLY Biome, no ESLint/Prettier)
     * `pnpm build` - Validate build succeeds
   
   - **Database validation** (if schema changed):
     * `pnpm db:generate` - Verify migrations are generated
     * `pnpm db:push` - Apply migrations to dev database
   
   - **Only if all tests and validations pass**: Stage changes (`git add .`)
   
   - **Clean up**: Remove any temporary files, console logs, and temporary code before committing
   
   - **Commit**: Use a descriptive commit message that:
     * Uses conventional commit format with workspace prefix (`feat(apps/web):`, `fix(agents):`, `refactor(packages/api):`, `chore(db):`, `test(web):`, `docs:`)
     * Summarizes what was accomplished in the parent task
     * Lists key changes and additions
     * Specifies affected workspace packages (e.g., `@live-steam-app/api`, `apps/web`, `/agents`)
     * References the task number and PRD context
     * **Formats the message as a single-line command using `-m` flags**, e.g.:

   ```bash
   git commit -m "feat(apps/web): add payment validation UI" -m "- Create PaymentForm component with shadcn/ui" -m "- Integrate with tRPC payment.validate mutation" -m "- Add Zod form validation" -m "- Include component unit tests" -m "Affects: apps/web, @live-steam-app/api" -m "Related to T2.0 in PRD #0001"
   ```

   **For agent-related changes:**
   ```bash
   git commit -m "feat(agents): add component builder agent" -m "- Implement Python agent in /agents/component_builder_agent.py" -m "- Define TypeScript contract in /packages/types/agent-schemas.ts" -m "- Add integration tests for agent API communication" -m "- Document approval workflow in README" -m "Affects: /agents, @live-steam-app/api, @live-steam-app/types" -m "Related to T4.0 in PRD #0002"
   ```

3. Once all the subtasks are marked completed and changes have been committed, mark the **parent task** as completed.

- Stop after each sub-task and wait for the user's go-ahead.

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above.
   - Add new tasks as they emerge during implementation.
   - Update task descriptions if requirements change.

2. **Maintain the "Relevant Files" section:**
   - List every file created or modified.
   - Give each file a one-line description of its purpose.
   - Group files by workspace package for clarity (`apps/web`, `packages/*`, `/agents`).
   - Update as new files are added during implementation.

## AI Instructions

When working with task lists in this monorepo, the AI must:

1. **Before starting work:**
   - Check which sub-task is next in the list.
   - Verify understanding of workspace structure and affected packages.
   - Identify dependencies on other packages that must be built first.

2. **During implementation:**
   - Follow the completion protocol exactly.
   - Mark each finished **sub-task** `[x]`.
   - Keep code changes focused on the current subtask only.
   - Use appropriate shared packages (`@live-steam-app/*`) instead of duplicating code.
   - Write tests alongside implementation (TDD approach when possible).
   - **Never duplicate agent logic** between `/agents` (Python), `/packages/api` (tRPC), `/apps/web` (frontend)
   - **Always validate API contract and type sharing** between Python agents and TypeScript packages

3. **Testing requirements:**
   - Write unit tests for all business logic.
   - Include integration tests for API endpoints and database interactions.
   - Test React components with appropriate testing libraries.
   - **Agent integration tests:** Test Python agent communication with tRPC endpoints
   - Ensure all tests pass before marking subtask complete.

4. **After completing sub-task:**
   - Update the task list file.
   - Run relevant tests (`pnpm test [path]`).
   - Pause and ask user for approval to continue.

5. **After completing all subtasks in a parent task:**
   - Run full validation suite:
     * `pnpm test` - All tests (including Python agent tests if applicable)
     * `pnpm check-types` - TypeScript validation
     * `pnpm biome` or `pnpm check` - Biome linting and formatting (ONLY Biome)
     * `pnpm build` - Full build validation
     * `pnpm db:push` - Database migration (if schema changed)
   - Clean up temporary code and console logs.
   - Stage, commit with proper conventional format using workspace prefix.
   - Mark **parent task** `[x]`.
   - Update "Relevant Files" section.

6. **Workspace-specific considerations:**
   - Always use `workspace:*` protocol for internal package dependencies.
   - Update `turbo.json` if task dependencies change.
   - Ensure new packages are added to root `package.json` workspaces array.
   - Run `pnpm install` after adding new dependencies.
   - Keep shared logic in appropriate packages, not in apps.
   - **Agent orchestration:**
     - For tasks relating to agent workflows, update `/agents` Python logic and implementation docs
     - All agent API/schema changes require a coordinated update in `/packages/types` and integration test in `apps/web` or `/packages/api`

7. **Desktop/PWA considerations:**
   - When implementing Tauri workflows, update `apps/web` and/or relevant build scripts
   - Ensure cross-platform compatibility (Windows, macOS, Linux)
   - Document desktop-specific features in the changelist
   - Update service workers for PWA offline support

8. **Linting and formatting:**
   - **ONLY use Biome** as the official formatting/linting tool (`pnpm biome` or `pnpm check`)
   - No manual formatting, no ESLint, no Prettier
   - All code must pass Biome checks before commit

9. **Performance and optimization:**
   - Leverage Next.js 16 features (Cache Components, Turbopack, React Server Components, async APIs).
   - Use proper caching strategies for tRPC queries.
   - Optimize component rendering and data fetching.
   - Follow shadcn/ui and Tailwind patterns.

10. **Error handling and validation:**
    - Implement proper error boundaries in React components.
    - Add input validation using Zod schemas in tRPC routes.
    - Handle edge cases and error states in UI.
    - Add appropriate error messages and user feedback.

## Commit Message Examples

### Feature Implementation (Frontend)
```bash
git commit -m "feat(apps/web): add user profile editing interface" -m "- Create ProfileEditor component with shadcn/ui" -m "- Integrate with tRPC profile.update mutation" -m "- Add Zod form validation" -m "- Include component unit tests" -m "Affects: apps/web, @live-steam-app/api" -m "Related to T2.0 in PRD #0001"
```

### API/Backend Changes
```bash
git commit -m "feat(packages/api): implement payment processing endpoints" -m "- Add payment.create and payment.verify tRPC procedures" -m "- Define Drizzle schema for payments table" -m "- Add authorization checks" -m "- Include comprehensive error handling" -m "Affects: @live-steam-app/api, @live-steam-app/db" -m "Related to T3.0 in PRD #0002"
```

### Agent Orchestration
```bash
git commit -m "feat(agents): add orchestrator agent for component generation" -m "- Implement Python orchestrator in /agents/orchestrator.py" -m "- Define TypeScript schemas in /packages/types/agent-schemas.ts" -m "- Add tRPC integration endpoints" -m "- Document approval workflow and API contract" -m "- Include Python and TypeScript integration tests" -m "Affects: /agents, @live-steam-app/api, @live-steam-app/types" -m "Related to T4.0 in PRD #0003"
```

### Shared Package Updates
```bash
git commit -m "feat(packages/ui): add DataTable component with shadcn/ui" -m "- Create reusable table with sorting and filtering" -m "- Use Tailwind utility classes for styling" -m "- Add accessibility features (ARIA labels)" -m "- Include component tests" -m "Affects: @live-steam-app/ui" -m "Related to T5.1 in PRD #0004"
```

### Database Schema Changes
```bash
git commit -m "feat(packages/db): add user preferences schema" -m "- Define Drizzle schema for user_preferences table" -m "- Generate migration with pnpm db:generate" -m "- Apply migration with pnpm db:push" -m "- Add seed data for testing" -m "Affects: @live-steam-app/db" -m "Related to T2.1 in PRD #0001"
```

### Desktop/PWA Features
```bash
git commit -m "feat(apps/web): add offline support for PWA" -m "- Update service worker for offline caching" -m "- Configure Tauri desktop permissions" -m "- Test cross-platform compatibility" -m "- Document desktop build instructions" -m "Affects: apps/web, apps/web/src-tauri" -m "Related to T6.0 in PRD #0005"
```

### Refactoring
```bash
git commit -m "refactor(packages/api): improve error handling middleware" -m "- Extract common error patterns into utility" -m "- Add structured error logging" -m "- Improve type safety for error responses" -m "Affects: @live-steam-app/api" -m "Related to T7.0 in PRD #0001"
```

### Testing
```bash
git commit -m "test(apps/web): add integration tests for checkout flow" -m "- Test full user journey from cart to confirmation" -m "- Mock tRPC procedures and auth state" -m "- Validate error handling and edge cases" -m "Affects: apps/web" -m "Related to T8.2 in PRD #0004"
```

### Multiple Workspaces
```bash
git commit -m "feat(apps/web,agents): integrate agent approval queue" -m "- Add approval UI in apps/web with shadcn/ui" -m "- Implement Python approval logic in /agents" -m "- Update TypeScript contracts in /packages/types" -m "- Add end-to-end integration tests" -m "Affects: apps/web, /agents, @live-steam-app/api, @live-steam-app/types" -m "Related to T3.0 in PRD #0006"
```

## Commit Convention Rules

- **Always prefix** with affected workspace/package using conventional commit format:
  - `feat(apps/web):` - Frontend feature
  - `feat(agents):` - Python agent feature
  - `feat(packages/api):` - tRPC API feature
  - `feat(packages/db):` - Database schema feature
  - `feat(packages/ui):` - UI component feature
  - `fix(apps/web):` - Frontend bug fix
  - `refactor(packages/api):` - API refactoring
  - `chore(turbo):` - Build system update
  - `test(apps/web):` - Test addition
  - `docs:` - Documentation update

- **When multiple workspaces affected**, specify all in the prefix:
  - `feat(apps/web,agents):` - Both frontend and agent changes
  - `feat(packages/api,db):` - Both API and database changes

## Type Safety and Workspace Boundaries

- **Never transfer or share code that breaks established folder isolation**
- Agent logic must stay in `/agents` (Python)
- Frontend logic must stay in `apps/web` (TypeScript/React)
- API logic must stay in `packages/api` (tRPC)
- Shared types must be in `/packages/types`
- Database schema must be in `packages/db`

## Success Criteria

### Agent Integration Checklist (if applicable)

✅ API contract matches between Python agents and TypeScript  
✅ Approval workflow documented and tested  
✅ Integration tests cover agent communication  
✅ Changelist updated with agent workflow details  
✅ Type definitions shared in `/packages/types` or `/agents/schemas`  
✅ Python docstrings reference agent communication model  
✅ README and API documentation updated  

### Subtask Completion Criteria

✅ Implementation matches the subtask description  
✅ Code follows workspace conventions and patterns  
✅ All relevant tests are written and passing  
✅ TypeScript compilation succeeds (`pnpm check-types`)  
✅ Biome linting passes (`pnpm biome` or `pnpm check`)  
✅ Code is properly formatted (Biome only)  
✅ Temporary code and console logs are removed  
✅ Task list is updated with `[x]` marker  
✅ User has approved the work  

### Parent Task Completion Criteria

✅ All subtasks are marked `[x]`  
✅ Full test suite passes (`pnpm test`, including agent tests if applicable)  
✅ Build succeeds (`pnpm build`)  
✅ All workspace validations pass  
✅ Database migrations applied (if schema changed)  
✅ Code is committed with proper conventional format  
✅ "Relevant Files" section is accurate and up-to-date  
✅ Agent integration checklist complete (if applicable)  

## Final Reminders

- **Never proceed to the next subtask without explicit user approval**
- **Always run tests before committing**
- **Keep changes focused and atomic**
- **Use conventional commit format with workspace prefix consistently**
- **Maintain workspace modularity and type safety**
- **Never duplicate agent logic between `/agents`, `/packages/api`, and `/apps/web`**
- **Always validate API contracts and type sharing**
- **Document non-obvious decisions in code comments**
- **Update task list immediately after completing work**
- **All commands use `pnpm`, never `bun` or `npm`**
- **Only use Biome for linting/formatting, never ESLint or Prettier**
