# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

Multi-component nutrition platform. Each sub-project has its own CLAUDE.md with detailed guidance:

| Project | Path | CLAUDE.md |
|---|---|---|
| Angular website (active) | `website/app/` | [website/app/CLAUDE.md](website/app/CLAUDE.md) |
| Angular website (legacy) | `website/legacy/` | [website/legacy/CLAUDE.md](website/legacy/CLAUDE.md) |
| Node.js API | `api/wsapi/` | [api/wsapi/CLAUDE.md](api/wsapi/CLAUDE.md) |
| .NET 10 API | `api/food-api/` | [api/food-api/CLAUDE.md](api/food-api/CLAUDE.md) |
| React Native demo app | `wireservers-ui/site/` | [wireservers-ui/site/CLAUDE.md](wireservers-ui/site/CLAUDE.md) |
| React Native component library | `wireservers-ui/packages/react-natives/` | [wireservers-ui/packages/react-natives/CLAUDE.md](wireservers-ui/packages/react-natives/CLAUDE.md) |

`website/legacy/` is a legacy reference — do not add features there.

## Shared Infrastructure

Both APIs (`wsapi` and `food-api`) connect to the same MongoDB instance (Azure Cosmos DB). They use identical collection names configured via environment variables:

```bash
MONGO_URI="mongodb+srv://...?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
DB_NAME="foods-test"                          # Use separate names per environment
DB_FOODS_COLLECTION="foundationfoods"
DB_NUTRITION_COLLECTION="nutritionfacts"
DB_RECIPES_COLLECTION="recipes"
DB_DIETS_COLLECTION="diettypes"
DB_BLOG_COLLECTION="blogposts"
DB_MEALPLANS_COLLECTION="mealplans"
DB_USERS_COLLECTION="users"
```

**Cosmos DB requirement:** Connection string must include `retrywrites=false`.

## Git Branches (react-natives library)

- `sot` — source of truth (main)
- `dev` — development
- `prod` — production
