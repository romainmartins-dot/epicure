# Epicure — Instructions pour Claude Code

## Vision projet

Epicure est une app mobile pour découvrir les vins naturels et les lieux qui les servent (caves, bars, restaurants). Cible : passionnés de vin nature + professionnels (chefs, cavistes, importateurs).

Marché : Lille → France → Europe. Langue : FR d'abord, EN ensuite.

## Stack technique

**Backend** (`/`)

- Node.js v25 + Express (en cours de migration vers Fastify + TypeScript)
- PostgreSQL 17 + PostGIS 3.6
- Architecture modulaire : `routes/`, `services/`, `db/`
- Variables sensibles dans `.env`

**Frontend** (`/raisin-mobile`)

- React Native + Expo (web + iOS + Android)
- TypeScript strict
- Architecture modulaire : `components/`, `hooks/`, `utils/`, `config.ts`
- Carte : Leaflet (web) + react-native-maps (natif), dispatcher dans `Map.tsx`

## Conventions de code

**Général**

- Noms de variables et fonctions en français quand c'est métier (adresses, cave, ville)
- Noms techniques en anglais (useState, fetch, render)
- Pas de commentaires inutiles, le code doit être lisible
- Toujours TypeScript en strict mode côté front

**Backend**

- Routes RESTful : GET `/adresses`, GET `/adresses/:id`, POST `/adresses`
- Validation des inputs obligatoire
- Réponses JSON cohérentes : `{ data, error }` ou directement le résultat
- Gestion d'erreurs : try/catch + status HTTP corrects

**Frontend**

- Components : 1 fichier = 1 composant
- Hooks : préfixés `use`, retournent un objet ou primitive
- Pas de logique métier dans les components, déléguer aux hooks
- Styles : StyleSheet en bas du fichier
- Pas de styles inline sauf cas exceptionnel

## Direction UX/UI : Apple-like

**Principes**

- Épuré, blanc, beaucoup d'espace
- Hiérarchie typographique forte (gros titres, petits secondaires)
- Animations subtiles (pas d'effets gratuits)
- Couleurs : neutres + accents par catégorie

**Palette**

- Fond principal : #FFFFFF
- Fond secondaire : #F2F2F7 (gris Apple)
- Texte principal : #1A1A1A
- Texte secondaire : #777
- Cave (rouge bordeaux) : #C0392B
- Restaurant (vert) : #27AE60
- Bar (bleu) : #2980B9

**Typographie**

- System font (San Francisco sur iOS, Segoe sur Web)
- Titres : 22-26px bold
- Corps : 14-15px
- Métadonnées : 11-12px

**Composants**

- Coins arrondis : 12-16px
- Ombres légères : `shadowOpacity 0.05-0.13`
- Boutons : padding généreux, fond plein pour action principale

## Règles strictes

- ❌ Ne jamais commiter `.env`, `node_modules/`, ou la clé API Google
- ❌ Pas de `console.log` en production
- ❌ Pas d'emojis dans le code (sauf UI)
- ✅ Toujours tester sur web ET iPhone avant de commiter
- ✅ Commits clairs : "feat: ajout filtre cépage", "fix: panel mobile zoom"
- ✅ Garder l'architecture modulaire (1 responsabilité par fichier)

## Modèle business

Freemium :

- Gratuit : carte, recherche ville, fiches, avis
- Premium 4,99€/mois : filtres avancés (cépage, pét-nat, orange, biodynamie), offline, listes illimitées
- Pro 19,99€/mois : importateurs, notes privées, export PDF (pour cavistes/restaurateurs)

## État actuel (avril 2026)

- ✅ Backend Node + PostgreSQL avec routes CRUD + géolocalisation
- ✅ ~2100 adresses importées (OSM + manuel)
- ✅ 64 adresses Lille vérifiées avec photos Google Places
- ✅ App fonctionnelle web + iOS via Expo
- ⏳ Migration Fastify + TypeScript en cours
- ⏳ Auth utilisateurs à venir
- ⏳ Cache Redis à venir
