# Epicure — Instructions pour Claude Code

## Vision projet

Epicure n'est pas un aggrégateur. C'est **le guide de référence des vins naturels**, porté par une communauté d'experts reconnus.

**Positionnement** : qualité absolue > quantité. Chaque adresse est une recommandation personnelle de Romain Martins (fondateur) ou d'un curateur expert de son réseau (caviste nature reconnu, chefs gastronomiques, sommeliers).

**Références** : Apple Maps (pour l'UX carte), Le Fooding (pour l'éditorial), Guide Lebey. Pas Google Maps. Pas TripAdvisor.

Marché : Lille → France → Europe. Langue : FR d'abord, EN ensuite.

---

## Direction produit (non négociable)

**1. Base du concept**
App simple, lisible, fluide, centrée sur l'exploration d'adresses déjà en base. On ne recrée pas TripAdvisor.

**2. Objectif principal**
Mettre en valeur les adresses existantes. Pas ajouter de logique métier.

**3. Carte en priorité**
La carte est l'entrée principale. Elle doit permettre de repérer rapidement les lieux et de naviguer naturellement.

**4. Style visuel**
S'appuyer sur les codes Apple Maps :
- icônes claires
- repères lisibles
- sensation native iOS
- interface légère, propre, évidente

**5. Scope initial**
Au début, seulement :
- afficher les adresses en base
- bien les distinguer visuellement
- bien les mettre en avant sur la carte
- permettre une consultation simple et fluide

**6. Pas de surcomplexité**
Pas de logique avancée type TripAdvisor.
Pas de multiplication de features tant que la base n'est pas parfaite.

**7. Détails spécifiques ensuite**
Une fois la base carte + adresses + lisibilité posée, on traite les besoins spécifiques.

**8. Panel ensuite, pas avant**
Le panel est important mais vient après la qualité de l'expérience principale. Il ne doit pas compliquer ou dégrader la fluidité de la carte.

**9. Priorité UX absolue**
Chaque interaction doit sembler naturelle, immédiate, simple.
Si une feature gêne la fluidité, elle doit être simplifiée ou repoussée.

**10. Règle de décision**
Toujours privilégier : simplicité, clarté, fluidité, mise en valeur des adresses.
Pas de sophistication prématurée.

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