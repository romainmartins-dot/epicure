# UX-QUALITY-BAR.md
# Barre de qualité produit Raisin

Dernière mise à jour : 2026-04-20
Décidé par Romain. Source de vérité pour tous les agents et toute PR.

---

## 1. STANDARD DE RÉFÉRENCE

**Apple Maps app native**, minimaliste, invisible.
Si un élément attire l'attention de l'utilisateur sur lui-même (shadow, anim, contraste), c'est un FAIL.

---

## 2. TOLÉRANCE BUG

**Zéro bug visible accepté.**
Une livraison qui contient un bug visuel (pin qui saute, label qui tremble, écran vide non géré, flash de rendu) est considérée comme incomplète, pas comme partielle.

Pas de "on fixera plus tard". Pas de "c'est un edge case".

---

## 3. PLATEFORMES

- **iOS** : priorité absolue, JAMAIS dégradé
- **Android** : qualité équivalente visée
- **Web** : qualité équivalente visée

Si arbitrage nécessaire : iOS gagne toujours.

---

## 4. PERFORMANCES NON-NÉGOCIABLES

- Tap sur un pin → panel ouvert en **< 100ms**
- Pins cliquables **immédiatement** au démarrage (jamais de "pins qui apparaissent progressivement")
- Jamais d'écran vide : loading / error / empty / offline toujours gérés avec fallback

---

## 5. ANIMATIONS & TRANSITIONS

**Apple-natives uniquement.**
- Spring iOS par défaut
- Aucune animation custom
- Aucun import de lib de motion (Reanimated, Lottie, etc.) sur la carte
- Aucune durée > 600ms

---

## 6. CARTE — RÈGLES DURES

- Apple Maps natif uniquement
- Clustering 100% natif Apple (aucune lib)
- `showsPointsOfInterest={false}` sur MapView
- Zoom initial : **sur GPS utilisateur si autorisé**, sinon fallback France
- MarkerPin existant autorisé, rien d'autre comme enfant de <Marker>

---

## 7. SYSTÈME DE MERGE — 3 NIVEAUX

### 🟢 NIVEAU 1 — AUTO-MERGE (agents, sans Romain)
Merge automatique si TOUTES ces conditions sont remplies :
- CI verte (typecheck + lint + tests)
- Aucun fichier DA-protégé modifié (cf DA.md)
- Aucune nouvelle dépendance npm
- Modification purement interne :
  - fix bug logique
  - ajout de tests
  - refactor non-visuel
  - correction typos, types, lint, format

Agents concernés : QA ouvre PR, orchestrator merge si conditions remplies.

### 🟡 NIVEAU 2 — VALIDATION ROMAIN (clic merge manuel)
Toute modif visible utilisateur :
- Nouvelle feature / écran / composant
- Modification comportement carte / panel / liste
- Changement de copy / texte utilisateur
- Changement de données affichées

Workflow :
1. Agents préparent la PR (product + engineer + qa + design-critic PASS)
2. Orchestrator prévient Romain avec URL PR
3. Romain teste l'app + review le diff
4. Romain clique "Merge" sur GitHub

### 🔴 NIVEAU 3 — INTERDIT ABSOLU (branch protection)
Jamais mergé, même par Romain, sans config spéciale temporaire :
- Toute modif de fichiers DA (cf DA.md liste complète)
- Toute nouvelle lib UI (clustering, icônes, animation, motion)
- Push direct sur main (quelle que soit la branche)

GitHub doit refuser techniquement ces modifs via branch protection rules.

---

## 8. CHECKLIST PAR PR (avant merge)

L'agent QA coche obligatoirement avant d'ouvrir la PR :

- [ ] typecheck : PASS
- [ ] lint : PASS
- [ ] tests existants impactés : PASS (si applicable)
- [ ] DA preservation : PASS (0 fichier DA-protégé touché)
- [ ] iOS testé : OK
- [ ] Critères d'acceptation spec : tous PASS
- [ ] Standard Apple Maps respecté (design-critic PASS)
- [ ] États loading/error/empty/offline gérés
- [ ] Aucune nouvelle dépendance ajoutée sans validation Romain
- [ ] Niveau merge identifié (🟢 / 🟡 / 🔴)

---

## 9. SI UN AGENT DOUTE

Règle d'or : **FAIL par défaut, pas PASS.**
Un agent qui hésite sur PASS/FAIL marque FAIL et renvoie vers engineer avec le motif.

Mieux vaut 2 cycles supplémentaires qu'un bug livré.

---

## 10. ROMAIN INTERVIENT UNIQUEMENT POUR

1. Valider une spec produit (question fermée OUI/NON)
2. Cliquer "Merge" sur une PR niveau 🟡
3. Débloquer un cas exceptionnel remonté par orchestrator

Tout le reste est orchestré par les agents.
