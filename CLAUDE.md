# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

`wsws` is a meta-repo wiring together the WireServers nutrition/wellness platform. Most top-level subdirectories are git submodules (see [.gitmodules](.gitmodules)) — when editing inside one, you are editing that submodule's own repo and its history is separate from the meta-repo.

Each component has its own CLAUDE.md with stack-specific guidance; read it before working in that tree:

| Component | Path | Purpose |
|---|---|---|
| Angular website (active) | [wireservers/app/](wireservers/app/CLAUDE.md) | Expo + React Native Web public site |
| Angular website (legacy) | `wireservers/legacy/` | Archived Angular 17 — **do not add features** |
| Node.js API | [apis/wsapi/](apis/wsapi/CLAUDE.md) | CRUD factory, soft-delete on all documents |
| .NET 10 API | [apis/food-api/](apis/food-api/CLAUDE.md) | Controllers → Services → Repositories, count caching, hard-delete |
| React Native component library | [packages/react-natives/](packages/react-natives/) | `@wireservers-ui/react-natives` (submodule) |
| Next.js component library | [packages/next-natives/](packages/next-natives/CLAUDE.md) | `@wireservers-ui/next-natives`, DOM/Next sibling to react-natives |
| BringThe consumer apps | [bringthe/](bringthe/CLAUDE.md) | `bring-the` hub + `bring-the-diet` monorepo + 16 stub apps |
| Auth/RBAC service | [wireservers-security/](wireservers-security/CLAUDE.md) | .NET 10 + Next.js 15, Entra External ID, three-layer authz |
| Next.js template | `wireservers-template/` | pnpm workspace, used to scaffold new BringThe apps |

Other top-level dirs (`apis/checklist-api`, `apis/exercise-api`, `apis/gamification-api`, `apis/project-templates-api`, `apis/substitution-api`, `apis/tech-stack-api`) are planned/early-stage APIs — check for a README before assuming there's code to run.

See [AGENTS.md](AGENTS.md) for a condensed cross-cutting reference (pitfalls, build commands, architecture decisions).

## Cross-Cutting Patterns

These apply across multiple components and aren't obvious from any single subtree:

- **Cosmos DB `retrywrites=false` is mandatory.** Both `wsapi` and `food-api` talk to the same Azure Cosmos DB (Mongo API). Without `retrywrites=false` the driver hangs on cascading retries. Full URI shape: `mongodb+srv://...?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`.
- **Soft-delete divergence.** `wsapi` (Node) soft-deletes every document; `food-api` (.NET) hard-deletes. Account for this when writing migrations or reasoning about "deleted" records.
- **Count caching (food-api).** Repositories cache `countDocuments()` for 5 minutes to save Cosmos RUs — preserve this when adding repositories.
- **Three-layer authorization (wireservers-security).** RBAC + ReBAC + ABAC; all three must pass. Global EF query filters on `Document` restrict `TeamId`.
- **Package managers differ per project.** `bring-the-diet` enforces `pnpm@10.28.0`; `wireservers-template` is a pnpm workspace; `wsapi` uses pnpm; most others use npm. Check `packageManager` in each `package.json` before running install.
- **`wireservers/legacy/` is archived.** Read-only reference for the old Angular site.

## Shared MongoDB Configuration

Both APIs read the same env-var names so they can point at the same database:

```bash
MONGO_URI="mongodb+srv://...?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
DB_NAME="foods-test"                          # use distinct names per environment
DB_FOODS_COLLECTION="foundationfoods"
DB_NUTRITION_COLLECTION="nutritionfacts"
DB_RECIPES_COLLECTION="recipes"
DB_DIETS_COLLECTION="diettypes"
DB_BLOG_COLLECTION="blogposts"
DB_MEALPLANS_COLLECTION="mealplans"
DB_USERS_COLLECTION="users"
```

## Quick Commands

Run from the project root unless noted:

| Component | Dev | Notes |
|---|---|---|
| food-api | `cd apis/food-api && dotnet run` | http://localhost:5000 |
| wsapi | `cd apis/wsapi && cp .env.example .env && npm run dev` | http://localhost:3000 |
| wireservers/app | `cd wireservers/app && npm start` | Expo + RN Web |
| bring-the (hub) | `cd bringthe/bring-the && npm run start` | Expo |
| bring-the-diet | `cd bringthe/bring-the-diet && pnpm i && pnpm dev` | web on :3001 |
| next-natives | `cd packages/next-natives && npm install && npm run build` | Next.js component library |
| wireservers-security API | `cd wireservers-security/api && dotnet run` | http://localhost:5080 |
| wireservers-security web | `cd wireservers-security/web && npm run dev` | http://localhost:3000 |
| Full stack (Docker) | `docker compose up` | builds all services per [docker-compose.yml](docker-compose.yml) |

The `docker-compose.yml` expects each API's `.env` to exist locally before `up`.

## Git Branches (react-natives library)

- `sot` — source of truth (main)
- `dev` — development
- `prod` — production

## Submodules

When pulling, also update submodules: `git submodule update --init --recursive`. Commits inside a submodule must be pushed to that submodule's remote before the meta-repo references them.
