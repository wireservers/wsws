# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

This directory holds the **BringThe family of consumer apps** — a hub plus per-app projects, each targeting its own domain (`bringthediet.com`, `bringthefitness.com`, etc.). Most apps are stubs; only two have code today:

| Path | Status | What it is |
|---|---|---|
| [bring-the/](bring-the/) | Active | Landing/hub app — `bringthe-hub`, Expo + expo-router, showcases all BringThe apps |
| [bring-the-diet/](bring-the-diet/) | Active | `@bringthediet/*` pnpm monorepo (Next.js web + Expo mobile + shared/ui packages). See [bring-the-diet/CLAUDE.md](bring-the-diet/CLAUDE.md) |
| `bring-the-{budget,crafts,events,fitness,games,garden,habits,health,learn,list,music,pets,projects,reads,recipes,travel}` | Placeholder | README stub only. Each line captures domain + which APIs it will consume |

When asked to work on an app that only has a README, first confirm with the user before scaffolding — these are intentionally empty until their turn.

## The `bring-the/` hub app

**Stack:** Expo SDK 54, expo-router v6 (typed routes + React Compiler experiments enabled), React 19, React Native 0.81, NativeWind 4, `@wireservers-ui/react-natives` for shared UI primitives.

### Commands (run inside [bring-the/](bring-the/))

```bash
npm run start          # expo start (native + web dev)
npm run web            # expo start --web
npm run build          # expo export --platform web  →  ./dist
npm run build:clean    # same, with --clear
npm run lint           # expo lint
npm run clean          # nuke .expo, node_modules/.cache, dist
```

No test runner is configured.

### Architecture

- **Routing** — expo-router file-based. Root [app/_layout.tsx](bring-the/app/_layout.tsx) wraps in `ThemeContextProvider` → `AppThemeProvider` (from react-natives) → `@react-navigation` `ThemeProvider`. Pages live under `app/(pages)/`: `index.tsx` (landing), `about.tsx`, and `apps/[slug].tsx` (per-app detail, reads from `APPS` array).
- **Source of truth for the app catalog** — [constants/apps.ts](bring-the/constants/apps.ts). Every card, detail page, and status badge reads from this single `APPS` array. Adding a new BringThe app to the hub = adding an entry here.
- **Theming** — [context/theme-context.tsx](bring-the/context/theme-context.tsx) exposes `colorScheme` + `toggleColorScheme`, defaulting to system and allowing user override. Combine with NativeWind `darkMode: "class"` and the `@wireservers-ui/react-natives/tailwind-preset` (see [tailwind.config.js](bring-the/tailwind.config.js)).
- **Styling** — components currently use inline RN style objects (see [components/app-card.tsx](bring-the/components/app-card.tsx)); Tailwind/NativeWind is wired up but not yet applied to the hub's own components.
- **Path alias** — `@/*` → project root, via `babel-plugin-module-resolver` in [babel.config.js](bring-the/babel.config.js) and matching `tsconfig.json` paths.

### Deployment

Dockerized static web export: [Dockerfile](bring-the/Dockerfile) runs `npx expo export --platform web` then serves `dist/` via nginx ([nginx.conf](bring-the/nginx.conf)) with SPA fallback (`try_files $uri $uri/ /index.html`).

## Parent-repo conventions that apply here

- The wider workspace is a nutrition/lifestyle platform; shared APIs live at [../api/](../api/) and the Angular site at [../wireservers/app/](../wireservers/app/). See [../CLAUDE.md](../CLAUDE.md) for the big picture.
- `bring-the-diet` and the `food-api` both read from the same MongoDB (Azure Cosmos DB) — use separate `DB_NAME` per environment; connection string must include `retrywrites=false`.
