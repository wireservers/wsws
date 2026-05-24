# WSWS Multi-Component Platform

This workspace contains a nutrition/wellness platform with multiple interconnected projects. AI agents must understand the architecture, conventions, and critical patterns to be productive.

## Critical Patterns & Pitfalls

- **Cosmos DB Connection Strings:** ALL MongoDB URIs MUST include `retrywrites=false` to prevent cascading retry errors and app hangs. Format: `mongodb+srv://...?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`
- **Count Caching (food-api):** Repositories cache `countDocuments()` for 5 minutes to save RUs. Preserve this pattern when adding new repositories.
- **Soft-Delete Divergence:** wsapi (Node.js) uses soft-delete on all documents; food-api (.NET) hard-deletes. Account for this in data migrations.
- **Package Manager:** bring-the-diet monorepo requires `pnpm 10.28.0` (enforced). Other projects use npm.
- **Authentication Layers (wireservers-security):** Defense-in-depth with RBAC + ReBAC + ABAC — all three layers must pass for authorization.

## Build/Test Commands

Agents should run these automatically when working on code:

- **food-api (.NET 10):** `dotnet restore && dotnet build && dotnet run` (HTTP :5000)
- **wsapi (Node.js):** `cp .env.example .env && npm run dev` (port 3000)
- **bringthe/bring-the-diet (pnpm monorepo):** `pnpm i && pnpm dev` (web :3001)
- **wireservers/app (Expo+RNW):** `npm start`
- **react-natives (npm package):** No build; ships source directly. Use `npx react-natives init` for setup.
- **next-natives (Next.js package):** `npm install && npm run build`; imports theme with `@wireservers-ui/next-natives/theme.css`.
- **wireservers-security (.NET + Next.js):** API: `dotnet run` (:5080); Web: `npm run dev` (:3000)

## Architecture Decisions

- **Repository Pattern (food-api):** Controllers → Services → Repositories → MongoDB.Driver with DI.
- **CRUD Factory (wsapi):** Auto-generated routes from config arrays with soft-delete and audit fields.
- **Compound Components (react-natives):** Context-based styling with Tailwind Variants.
- **Authorization Dispatch (wireservers-security):** Swappable admin UI templates (a/b/c) per user.

## Project-Specific Conventions

- Do NOT add features to `wireservers/legacy/` (archived Angular 17).
- bringthe/bring-the-diet: Inline React.CSSProperties + CSS custom properties (NOT Tailwind classes).
- wireservers-security: Three-layer auth; global query filters on `Document` restrict TeamId.
- react-natives: Components use `React.forwardRef`, `displayName`, `tv()` from Tailwind Variants.
- next-natives: DOM components mirror react-natives variant names, use `React.forwardRef`, `displayName`, and `tv()`.

## Environment Variables

See [ESSENTIAL_KNOWLEDGE.md](/memories/repo/ESSENTIAL_KNOWLEDGE.md) for complete reference table.

## Quick Start for Agents

1. Read the project's CLAUDE.md (see [root CLAUDE.md](CLAUDE.md) for table).
2. Check `.env.example` or `appsettings.json` for required vars.
3. Run the appropriate dev command above.
4. If issues: Verify `retrywrites=false` in Cosmos URIs; use correct package manager; check for `.env` files.

## Documentation Links

- [Root CLAUDE.md](CLAUDE.md): Workspace overview and project table.
- [apis/food-api/CLAUDE.md](apis/food-api/CLAUDE.md): .NET architecture, count caching.
- [apis/wsapi/CLAUDE.md](apis/wsapi/CLAUDE.md): Node.js CRUD factory, soft-delete.
- [wireservers/app/CLAUDE.md](wireservers/app/CLAUDE.md): Expo+RNW setup.
- [bringthe/bring-the-diet/CLAUDE.md](bringthe/bring-the-diet/CLAUDE.md): pnpm monorepo, styling.
- [packages/react-natives/packages/react-natives/CLAUDE.md](packages/react-natives/packages/react-natives/CLAUDE.md): Component library patterns.
- [packages/next-natives/CLAUDE.md](packages/next-natives/CLAUDE.md): Next.js component library patterns.
- [wireservers-security/CLAUDE.md](wireservers-security/CLAUDE.md): Authorization layers.
- [ESSENTIAL_KNOWLEDGE.md](/memories/repo/ESSENTIAL_KNOWLEDGE.md): Complete reference (build commands, pitfalls, key files).

## Common Issues

- "retrywrites connection string error": Add `retrywrites=false` to MONGO_URI.
- "Metro cannot resolve module": Ensure `node-linker=hoisted` in `.npmrc` for pnpm projects.
- "react-dom version skew": Use react-natives CLI to pin versions.
- "Dev escape hatch in production": Never deploy `ALLOW_DEV_USER_HEADER=true`.
- ".env not found": Run `cp .env.example .env` first.
- "Tailwind classes not applied": Add library source to `content` array in tailwind.config.js.</content>
<parameter name="filePath">/Users/toddclarkston/source/wsws/AGENTS.md
