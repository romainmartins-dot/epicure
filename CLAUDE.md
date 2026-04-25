# Epicure — Instructions pour Claude Code

## Vision projet

Epicure n'est pas un aggrégateur. C'est **le guide de référence des vins naturels**, porté par une communauté d'experts reconnus.

**Positionnement** : qualité absolue > quantité. Chaque adresse est une recommandation personnelle de Romain Martins (fondateur) ou d'un curateur expert de son réseau (caviste nature reconnu, chefs gastronomiques, sommeliers).

**Références** : Apple Maps (pour l'UX carte), Le Fooding (pour l'éditorial), Guide Lebey. Pas Google Maps. Pas TripAdvisor.

Marché : Lille → France → Europe. Langue : FR d'abord, EN ensuite.

---

## Direction produit (non négociable)

**Positionnement fondamental**
Epicure n'est pas une app de cartographie. C'est un guide éditorial porté par des curateurs experts.

La carte est un outil d'accès, pas notre plus-value. On ne rivalisera jamais avec Apple Maps sur la carte.
Notre valeur = la sélection + les avis de curateurs reconnus.

**Scope V1 (priorité absolue)**

1. **Carte = commodity stable.** Elle doit fonctionner, ne pas ralentir, ne pas bugger. Point.
2. **Marqueurs = épingles Apple Maps style.** Basiques, lisibles. Pas de sophistication.
3. **Clustering standard** — intégré à react-native-maps, pas de dev custom.
4. **Panel = notre produit.** C'est là qu'on met toute l'énergie : photo, nom, curateur, commentaire éditorial, type de vin, ambiance.
5. **Fiche adresse** = expérience éditoriale premium (quand on passera du panel à la fiche complète).

**Règles de scope**

- ❌ Ne pas chercher à réinventer la carte. Tout ce qui peut être fait par Apple Maps/Leaflet natif, on utilise le natif.
- ❌ Pas d'animation custom de carte. Les animations natives suffisent.
- ❌ Pas de clustering custom. Le clustering natif de react-native-maps fait le job.
- ✅ Énergie et itérations concentrées sur le panel et les fiches adresses.
- ✅ Curateur visible partout : c'est notre USP.

**Règle de décision**

À chaque fonctionnalité, se poser : "Est-ce que ça renforce la sélection et la curation (notre USP), ou est-ce que j'essaie d'améliorer la carte (commodity) ?"

Si c'est la carte = repousser.
Si c'est la curation/éditorial = prioriser.
---

## Stack technique

**Backend** (`/`)
- Node.js v25 + Express (migration Fastify + TypeScript à venir)
- PostgreSQL 17 + PostGIS 3.6
- Architecture modulaire : `routes/`, `services/`, `db/`
- Variables sensibles dans `.env`

**Frontend** (`/raisin-mobile`)
- React Native + Expo (web + iOS + Android)
- TypeScript strict
- Architecture modulaire : `components/`, `hooks/`, `utils/`, `config.ts`
- Carte : Leaflet (web) + react-native-maps (natif), dispatcher dans `Map.tsx`

---

## Données : qualité absolue

**Structure adresse** :
- `id`, `nom`, `type` (cave/restaurant/bar)
- `adresse`, `ville`, `latitude`, `longitude`
- `description` rédigée (pas copiée de Google)
- `curateur` — qui a validé
- `cepages`, `styles` (pet-nat, orange, biodynamie) — filtres premium

**Règles** :
- ❌ Pas d'import OSM en masse, pas d'import Google Places automatique
- ❌ Pas d'adresse sans curateur identifié
- ✅ Chaque ajout = validation humaine
- ✅ 50 adresses excellentes > 5000 adresses moyennes

---

## Conventions de code

**Général**
- Noms métier en français (adresses, cave, ville, curateur)
- Noms techniques en anglais (useState, fetch, render)
- Pas de commentaires inutiles
- TypeScript strict côté front

**Backend**
- Routes RESTful claires
- Validation des inputs obligatoire
- Gestion d'erreurs : try/catch + status HTTP corrects
- Cache obligatoire pour appels externes (photos Google)

**Frontend**
- 1 fichier = 1 composant
- Hooks préfixés `use`, retournent objet ou primitive
- Pas de logique métier dans les components
- Styles : StyleSheet en bas du fichier, pas d'inline

---

## UX/UI : Apple Maps style

**Palette**
- Fond principal : #FFFFFF
- Fond secondaire : #F2F2F7
- Texte principal : #1A1A1A
- Texte secondaire : #777
- Cave (rouge bordeaux) : #C0392B
- Restaurant (vert) : #27AE60
- Bar (bleu) : #2980B9

**Typographie**
- System font (San Francisco iOS, Segoe Web)
- Titres : 22-26px bold
- Corps : 14-15px
- Métadonnées : 11-12px

**Composants**
- Coins arrondis : 12-16px
- Ombres légères : shadowOpacity 0.05-0.13
- Boutons : padding généreux, fond plein pour action principale

---

## Performance : non négociable

- Images : lazy loading, placeholder avant chargement
- Listes : FlatList (virtualisation) dès >20 items
- Animations : react-native-reanimated, toujours thread UI
- Pas de setState en boucle
- Mémoriser les composants lourds
- Debounce sur la recherche
- 60 fps partout, chargement < 1s
- Standard d'interaction : iOS natif (aucune latence perceptible)

---

## Règles strictes

- ❌ Ne jamais commiter `.env`, `node_modules/`, clé API Google
- ❌ Pas de `console.log` en production
- ❌ Pas d'emojis dans le code (sauf UI)
- ❌ Pas d'ajout de feature sans validation Romain
- ✅ Tester sur web ET iPhone avant commit
- ✅ Commits clairs : "feat: ajout filtre cépage", "fix: panel mobile zoom"
- ✅ Architecture modulaire (1 responsabilité par fichier)

---

## Modèle business

Freemium :
- **Gratuit** : carte, recherche ville, fiches, avis
- **Premium 4,99€/mois** : filtres avancés (cépage, pét-nat, orange, biodynamie), offline, listes illimitées
- **Pro 19,99€/mois** : importateurs, notes privées, export PDF (cavistes, restaurateurs, sommeliers)

---

## Règle d'or — Discipline de vérification finale (PERMANENTE)

Tu n'as PAS le droit d'écrire "MISSION TERMINÉE", "c'est OK", "validé", "ship it" ou équivalent sans avoir fait dans les 60 secondes précédentes :

1. `xcrun simctl io screenshot /tmp/qa_xxx.png` — screenshot FRAIS
2. `Read /tmp/qa_xxx.png` — lecture de l'image
3. Comparaison EXPLICITE à la checklist, critère par critère, verdict OK/KO

Si le simulateur est shutdown → reboot AVANT de déclarer quoi que ce soit.
Si 1 critère KO → fix et recommence. Ne jamais déclarer terminé sans les 3 étapes.

---

## 5. UX / DA

Voir `UX-QUALITY-BAR.md` pour les règles UI détaillées.

Règles clés résumées :
- Standard Apple minimal, pas de bling
- Zéro bug visuel toléré
- iOS priorité absolue
- Animations Apple natives (spring iOS) seulement
- Tap pin → panel < 100ms
- Pas d'émoji, pas de custom, sauf décision produit

---

## 6. COMMUNICATION AVEC ROMAIN

### Il te faut interrompre Romain QUE pour :

- Validation d'une décision produit structurante (modif archi, choix de lib)
- Merge d'une PR
- Blocage dur avec BLOCKERS.md

### Tu n'interromps PAS Romain pour :

- Demander s'il veut merger une PR mineure → fais la PR, il verra
- Confirmer une commande standard git/npm → fais-la
- Vérifier un choix technique dans ton périmètre → tranche toi-même et documente

### Quand tu demandes à Romain

- Question formulée en 1 phrase
- Options explicites (A / B / C)
- Recommandation par défaut

### Quand tu réponds

- Factuel, bref
- Pas de "je vais essayer" → tu fais ou tu dis pourquoi tu peux pas
- Pas de flatterie, pas de meta-commentaires

---

## 7. GESTION DES ERREURS

### Si une commande bash échoue

1. Lis le message d'erreur
2. Identifie la cause (5 hypothèses max)
3. Fix la cause la plus probable
4. Si toujours KO après 2 tentatives : change d'approche, ne boucle pas

### Si tu es bloqué

1. Écris `BLOCKERS.md` à la racine avec :
   - État actuel
   - Ce qui a été tenté
   - Hypothèses restantes
   - Ce que tu attends de Romain
2. Stop. Ne relance pas de boucle.

### Si une CI casse

1. REVERT immédiat le commit fautif
2. Analyse logs CI
3. Fix en local
4. Re-commit + push
5. Si 3 tentatives KO : BLOCKERS.md

---

## 8. INTERDICTIONS ABSOLUES

- Modifier des fichiers hors `~/epicure/` sans autorisation explicite
- Installation globale (`npm install -g`, `brew install`)
- Modifier `.github/workflows/` sans raison technique documentée
- Push direct sur main
- Déclarer "terminé" sans screenshot lu à l'instant T
- Boucle infinie (max 15 itérations sur une même mission)
- Amélioration non demandée
- Refacto hors périmètre
- Supprimer un fichier sans vérifier qu'il n'est plus importé
- Commit message qui ment sur ce qui a été fait

---

## 9. QUALITÉ DE CODE

- TypeScript strict, pas de `any` sauf justification dans un commentaire
- Noms explicites (`adressesActives` plutôt que `data`)
- Fonctions < 40 lignes
- Fichiers < 300 lignes (si plus : découper)
- 1 composant = 1 fichier
- Pas de logique métier dans les components (toujours dans hooks ou store)
- Tests pour toute fonction métier non triviale

---

## 10. DOCUMENTATION OBLIGATOIRE

À maintenir à jour à chaque session :

- `STRATEGY.md` : vision, phases, modèles éco
- `ARCHI.md` : architecture technique
- `UX-QUALITY-BAR.md` : règles UX/DA
- `CLAUDE.md` : ces guidelines (ce fichier)

À générer pour chaque mission :

- `docs/specs/[feature].md` : spec PO/PM avant dev
- `docs/qa/[feature].md` : rapport QA après dev

À générer en cas de blocage :

- `BLOCKERS.md` : état bloquant + attente

---

## 11. CHECKLIST DÉBUT DE SESSION

Avant toute mission, Claude Code doit :

1. Lire `CLAUDE.md` (ce fichier)
2. Lire `STRATEGY.md`
3. Lire `ARCHI.md`
4. Lire `UX-QUALITY-BAR.md`
5. Vérifier l'état Git (`git status`, `git log --oneline -5`)
6. Confirmer la branche courante
7. Lister les PRs ouvertes (`gh pr list`)
8. Répondre explicitement : "Guidelines lues, prêt pour mission."

---

## 12. PRINCIPE FINAL

**Rigueur > Vitesse.**

Une PR lente mais propre > 10 PRs rapides bancales.
Tu n'es pas jugé sur le nombre de commits, mais sur la stabilité et la qualité du livrable.

Si un doute : tu arrêtes, tu documentes, tu demandes.
Jamais de bluff. Jamais de "ça marche" non vérifié.

---

## État actuel (avril 2026)

- ✅ Backend Node + PostgreSQL routes CRUD + géolocalisation
- ✅ ~20 adresses Lille validées manuellement (V1)
- ✅ Photos Google Places intégrées
- ✅ App fonctionnelle web + iOS via Expo
- ⏳ Priorité : perfectionner la carte (style Apple Maps)
- ⏳ Ajout champ `curateur` dans DB
- ⏳ Migration Fastify + TypeScript
- ⏳ Cache Redis photos
- ⏳ Auth utilisateurs