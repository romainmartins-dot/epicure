# Epicure — Agent Instructions

## Project overview

Epicure is a geolocated wine venue guide (caves, restaurants, bars à vins).
Stack: Node/Express + PostGIS (API) · Expo/React Native + Leaflet (mobile/web).
Target: worldwide, multi-platform, multi-agent development.

## Monorepo structure

```
epicure/
├── db/               PostgreSQL pool singleton
├── routes/           Express route handlers (one file per resource)
├── services/         External API integrations (Google Places, …)
├── index.js          Express entry point
├── .env              Never commit — see .env.example
└── raisin-mobile/    Expo app (iOS · Android · Web)
    ├── app/          expo-router screens
    ├── components/   Reusable UI components
    ├── hooks/        Data-fetching hooks
    └── utils/        Types, formatters, constants
```

## Non-negotiable rules

- **Never push directly to `main`.** Always open a PR, even solo.
- **Never commit `.env`** or any file containing secrets.
- **Never use `git push --force`** on `main` or `develop`.
- **Never skip hooks** (`--no-verify` is forbidden).
- CI must be green before merging.

## Branch naming

```
feat/<short-description>      new feature
fix/<short-description>       bug fix
chore/<short-description>     tooling, deps, refacto
perf/<short-description>      performance improvement
docs/<short-description>      documentation only
```

One concern per branch. Branches must be short-lived (≤ 3 days ideally).

## Commit messages — Conventional Commits

```
feat: add map clustering for >500 markers
fix: panel touch area blocked by layout box
perf: reduce animation duration to eliminate tail bounce
chore: extract PhotoModal from PanelNative
```

Format: `<type>(<optional scope>): <description>`  
Types: `feat` `fix` `perf` `chore` `docs` `test` `refactor`  
Body and footer optional. No period at end of subject.

## Code style

- **Prettier** enforced — never manually reformat, let prettier handle it.
- **TypeScript strict** in `raisin-mobile/` — no `any`, no `// @ts-ignore`.
- **No comments that explain what** — only why (hidden constraint, workaround, non-obvious invariant).
- **No unused imports**, no dead code.
- **No feature flags or backward-compat shims** — just change the code.
- Default exports for screens and components, named exports for hooks and utils.

## API (Node/Express)

- Routes in `routes/` — one file per resource, thin handlers.
- DB queries only in route handlers or dedicated service files.
- Always validate and sanitize user input at route entry.
- Pagination via `limit` + `offset` query params (default limit 20, max 100).
- Error responses: `{ error: string }` with appropriate HTTP status.
- The Google Places API key lives in `.env` only — never proxy the key to the client.

## Mobile (Expo / React Native)

- Animations: `react-native-reanimated` with `withTiming` + `Easing.bezier` — no `withSpring` (causes perceived bounce).
- Gestures: `react-native-gesture-handler` — always wrap root in `GestureHandlerRootView`.
- Platform splits: use `Platform.OS` or `.native.tsx` / `.web.tsx` file suffixes.
- Height animation over translateY for bottom panels (touch area = visible area).
- Haptics: wrap in `if (Platform.OS !== "web")` guard.
- `useSharedValue` / `useAnimatedStyle` for anything animated — never `useState` for animation values.

## Testing

- No tests yet — when adding, use Jest for API, and React Native Testing Library for components.
- Never mock the database in integration tests.

## What NOT to do

- Do not add error handling for scenarios that can't happen.
- Do not add abstractions for hypothetical future requirements.
- Do not refactor code outside the scope of the current task.
- Do not create `*.md` documentation files unless explicitly asked.
- Do not add inline comments explaining what the code does — name things well instead.
