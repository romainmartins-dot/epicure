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
- ✅ Clustering via `react-native-map-clustering` (wrapper léger MapView, décision 2026-04-19).
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