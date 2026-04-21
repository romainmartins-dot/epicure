# ARCHI.md — Architecture Raisin (Netflix-style)

## Principe
Découpage feature-based, scalable, inspiré de Netflix/Spotify/Airbnb.
Chaque feature est autonome, testable, remplaçable.

## Structure

```
raisin-mobile/
├── app/                          # Expo Router (routes uniquement)
│   ├── _layout.tsx               # layout racine
│   ├── index.tsx                 # écran carte (MVP)
│   └── liste.tsx                 # écran liste
│
├── src/
│   ├── features/                 # Découpage par feature métier
│   │   ├── map/                  # Carte, markers, clustering
│   │   │   ├── components/       # MapNative, MarkerPin, ClusterBadge
│   │   │   ├── hooks/            # useMapState, useMapBounds
│   │   │   └── index.ts          # exports publics de la feature
│   │   │
│   │   └── adresses/             # Data adresses (API, types, sélecteurs)
│   │       ├── api/              # Endpoints RTK Query
│   │       ├── types/            # Adresse, Type, Coords (TypeScript)
│   │       └── index.ts
│   │
│   ├── shared/                   # Transverse (pas lié à une feature)
│   │   ├── ui/                   # Design system figé (boutons, inputs, etc.)
│   │   ├── hooks/                # Hooks génériques réutilisables
│   │   └── utils/                # Helpers purs (formatters, validators)
│   │
│   ├── store/                    # Redux Toolkit + RTK Query
│   │   ├── index.ts              # configuration du store
│   │   └── middleware.ts         # middlewares custom éventuels
│   │
│   └── config/                   # API URL, env, constantes
│       └── index.ts
│
└── __tests__/                    # Tests miroirs de src/
```

### Rôle de chaque couche

- **app/** : routing uniquement, aucune logique métier. Importe depuis src/features/.
- **src/features/** : chaque feature est un module autonome avec ses composants, hooks, types, API. Une feature peut être supprimée sans casser les autres.
- **src/shared/** : code réutilisable par plusieurs features. Jamais de logique métier spécifique.
- **src/store/** : état global + état serveur (RTK Query). Configuration centralisée.
- **src/config/** : constantes d'environnement. API URL, clés publiques (jamais de secret).
- **__tests__/** : miroir de src/, chaque feature a ses tests à côté.

## Règles inter-couches (NON NÉGOCIABLES)

1. `app/` importe UNIQUEMENT depuis `src/features/*`
2. `features/X` n'importe JAMAIS `features/Y` directement → passe par `shared/` ou `store/`
3. Aucun `fetch` direct dans `components/` → toujours via un hook RTK Query
4. `shared/ui/` = design system figé (DA) → modif = décision produit explicite
5. `store/` = seule source de vérité pour l'état serveur + global

## Stack validée

- RTK Query (fetch + cache + invalidation)
- Redux Toolkit (state global)
- Zod (validation API)
- Context7 MCP (doc à jour dans agents)

## Alerte dérive

Toute PR qui viole ces règles = FAIL automatique (QA agent).
