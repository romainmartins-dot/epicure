# OVERNIGHT.md — NUIT 19/04/2026

Lire CLAUDE.md AVANT chaque tâche. DA intouchable. Push après chaque commit.

## TÂCHE 1 — Audit silencieux (LECTURE SEULE)
Créer AUDIT.md avec : structure projet, bugs (fichier:ligne), fichiers >300 lignes, TODO/FIXME, top 20 any, code mort, tests manquants, deps en doublon.
AUCUN fichier source modifié. Commit : docs(audit): initial repo audit. Push.

## TÂCHE 2 — Setup tests si manquant
Vérifier npm test, sinon installer vitest. Scripts test/lint/typecheck. 1 test smoke vert.
Commit : chore(test): setup test infrastructure. Push. Si déjà OK → SKIP.

## TÂCHE 3 — Tests logique métier (3-5 fonctions/hooks non visuels)
Happy path + 3 edge cases min par test. 1 commit par fichier : test(scope): cover X. Push.

## TÂCHE 4 — Fix bugs logiques (max 5)
1. test reproduit (rouge) 2. fix (vert) 3. suite vert 4. commit fix(scope): desc. Push.
Bug touche DA → SKIP. Fix >50 lignes → SKIP.

## TÂCHE 5 — Robustesse états (3 écrans, composants EXISTANTS uniquement)
loading/error/empty/offline + tests. 1 commit par écran : feat(screen): handle states. Push.
Composant visuel manque → SKIP.

## TÂCHE 6 — Éliminer any faciles (max 10)
1 commit par fichier : refactor(types): remove any in X. Push. Refacto >30 lignes → SKIP.

## TÂCHE 7 — Nettoyer console.log + dead code
1 commit : chore: remove debug logs and dead code. Push.

## STOP : 6h OU 15 commits OU 5 BLOCKERS
Générer REPORT.md → commit docs: overnight session report → push → fin.

## RAPPELS
- DA INTOUCHABLE
- tests d'abord
- push après chaque commit
- dans le doute, SKIP
