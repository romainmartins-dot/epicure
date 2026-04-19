# CLAUDE.md — RÈGLES OVERNIGHT EPICURE/RAISIN

Branche : `overnight/20260419` UNIQUEMENT.
Tag rollback : `rollback-20260419-0522`.

## 1. DA SANCTUARISÉE — INTERDITS
Ne JAMAIS modifier :
- `tailwind.config.*`, `postcss.config.*`
- `raisin-mobile/styles/**`, `raisin-mobile/components/ui/**`
- `raisin-mobile/design-system/**`, `assets/**`
- tout `*.theme.*`, `*.tokens.*`, `*.css`, `*.scss` existant
- les composants visuels existants (Map, Panel, etc. — ne pas refacto le visuel)

Ne JAMAIS :
- changer couleurs, fonts, spacing, radius, shadows, animations
- ajouter de lib UI / icônes / animation
- "améliorer le rendu" d'un composant existant
- modifier les classes Tailwind d'un composant existant

Si tenté → STOP, log BLOCKERS.md, skip.

## 2. AUTORISÉ
- nouvelles features avec composants existants
- fix bugs logiques (state, data, nav, API, async)
- ajout de tests
- refacto non-visuel (hooks, utils, services, types)
- éliminer dead code, `any`, `console.log`

## 3. DEFINITION OF DONE
1. plan + critères d'acceptation
2. tests d'abord (TDD)
3. implémentation
4. `npm test` vert
5. `npm run lint` clean (0 warning)
6. `npm run typecheck` ou `tsc --noEmit` clean
7. `npm run build` OK
8. self-review hostile du diff
9. edge cases : loading, error, empty, offline, input invalide
10. `git diff --stat` → 0 fichier DA touché
11. commit atomique + push immédiat

## 4. RÈGLES DURES
- 1 test rouge → pas de commit
- 1 warning lint/type → pas de commit
- jamais skip un test, jamais mocker pour faire passer
- jamais `--no-verify`
- jamais commit "WIP" / "tmp"
- bloqué 3x → skip + BLOCKERS.md
- format : `type(scope): description`
- push après CHAQUE commit sur `origin/overnight/20260419`

## 5. STOP CONDITIONS
- 6h écoulées
- 15 commits atteints
- 5+ entrées BLOCKERS.md
- commande système qui casse

À l'arrêt : générer REPORT.md, dernier commit, push, fin.

## 6. LIVRABLES
- `BLOCKERS.md` : tâches skip + raison + ce qui aurait été nécessaire
- `REPORT.md` : DONE (avec hash), SKIP, fichiers touchés, tests ajoutés, suggestions DA (sans appliquer), dette technique, next steps

## 7. RÈGLE D'OR
Dans le doute → SKIP. Romain préfère 4 tâches nickel à 10 tâches bancales.
