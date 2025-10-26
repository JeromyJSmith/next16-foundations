# live-steam-app

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **tRPC** - End-to-end type-safe APIs
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **PWA** - Progressive Web App support
- **Tauri** - Build native desktop applications
- **Turborepo** - Optimized monorepo build system

## Next.js 16 Features

This project leverages the latest features of Next.js 16.0.1-canary.2, including:

*   **React Compiler:** Enabled for automatic component memoization and reduced re-renders.
*   **Cache Components:** Advanced caching mechanisms with configurable profiles (`seconds`, `minutes`, `hours`, `days`, `agents`) for optimized data fetching and revalidation.
*   **Async Server Components:** Full support for `await` in `params`, `searchParams`, `cookies()`, and `headers()`.
*   **Turbopack:** Default bundler for faster development and build times.

For a detailed guide on these features and migration patterns, refer to [NEXT16_MIGRATION_GUIDE.md](./NEXT16_MIGRATION_GUIDE.md).

## Getting Started

### Quick Start for New Developers

To get the project up and running quickly:

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Setup Python agents:**
    ```bash
    cd agents && uv venv && uv sync
    ```
3.  **Database Setup:**
    *   Ensure PostgreSQL is running.
    *   Configure `apps/web/.env` with your database details.
    *   Apply schema: `pnpm db:push`
4.  **Run development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3001](http://localhost:3001) in your browser.

### Detailed Installation

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:
```bash
pnpm db:push
```


Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.







## Project Structure

```
live-steam-app/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic (tRPC)
│   └── db/          # Database layer (Drizzle ORM)
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm dev:web`: Start web app only
- `pnpm build`: Build all applications
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm check`: Run Biome formatting and linting
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open Drizzle Studio UI
- `pnpm db:generate`: Generate database types

## Desktop & PWA

- `cd apps/web && pnpm generate-pwa-assets`: Generate PWA assets
- `cd apps/web && pnpm desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && pnpm desktop:build`: Build Tauri desktop app

## Troubleshooting

*   **"No tasks were executed" during `pnpm check-types`:** Ensure `check-types` scripts are defined in each package's `package.json` (e.g., `"check-types": "tsc --noEmit"`).
*   **Cache-related issues:** Refer to [NEXT16_MIGRATION_GUIDE.md](./NEXT16_MIGRATION_GUIDE.md) for detailed explanations of cache profiles, `cacheTag`, `revalidateTag`, and `updateTag`.
*   **Agent connectivity:** Verify Python agents are running (`pnpm dev:agents`) and check their logs for errors.