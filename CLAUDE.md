# Epicure — Instructions pour Claude Code

## Vision projet

Epicure n'est pas un aggrégateur. C'est **le guide de référence des vins naturels**, porté par une communauté d'experts reconnus.

**Positionnement** : qualité absolue > quantité. Chaque adresse est une recommandation personnelle de Romain Martins (fondateur) ou d'un de ses curateurs experts (caviste nature reconnu, chefs gastronomiques amis, sommeliers).

Pas une adresse n'est dans Epicure si elle n'est pas **validée humainement** par un expert du réseau.

**Références culturelles** : Le Fooding (à ses débuts), Guide Lebey, Noma Projects. Pas Google Maps. Pas TripAdvisor.

Marché : Lille → France → Europe. Langue : FR d'abord, EN ensuite.

## Principes directeurs (ordre de priorité)

1. **Curation humaine** — chaque adresse a un curateur identifié, c'est le signal de confiance central
2. **Performance** — 60fps partout, chargement initial < 1s, pas de feature qui ralentit l'app
3. **Épure** — moins de features, mieux exécutées. Quand on doute d'ajouter quelque chose, on ne l'ajoute pas.
4. **Beauté** — une app qu'on a envie d'ouvrir. Typographie, photos, espace.

## Stack technique

**Backend** (`/`)
- Node.js v25 + Express (migration vers Fastify + TypeScript à venir)
- PostgreSQL 17 + PostGIS 3.6
- Architecture modulaire : `routes/`, `services/`, `db/`
- Variables sensibles dans `.env`

**Frontend** (`/raisin-mobile`)
- React Native + Expo (web + iOS + Android)
- TypeScript strict
- Architecture modulaire : `components/`, `hooks/`, `utils/`, `config.ts`
- Carte : Leaflet (web) + react-native-maps (natif), dispatcher dans `Map.tsx`

## Données : qualité absolue

**Structure adresse** :
- `id`, `nom`, `type` (cave/restaurant/bar)
- `adresse`, `ville`, `latitude`, `longitude`
- `description` — rédigée, pas copiée de Google
- `curateur` — nom ou pseudo du curateur qui a validé
- `note_curateur` — commentaire personnel du curateur
- `cepages`, `styles` (pet-nat, orange, biodynamie) — filtres premium
- `date_validation` — traçabilité

**Règles strictes** :
- ❌ Pas d'import OSM en masse, pas d'import Google Places automatique
- ❌ Pas d'adresse sans curateur identifié
- ✅ Chaque ajout passe par une validation humaine
- ✅ Moins de 100 adresses la première année est acceptable si elles sont toutes excellentes

## Conventions de code

**Général**
- Noms de variables et fonctions en français quand c'est métier (adresses, cave, ville, curateur)
- Noms techniques en anglais (useState, fetch, render)
- Pas de commentaires inutiles, le code doit être lisible
- TypeScript en strict mode côté front

**Backend**
- Routes RESTful : GET `/adresses`, GET `/adresses/:id`, POST `/adresses`
- Validation des inputs obligatoire
- Réponses JSON cohérentes
- Gestion d'erreurs : try/catch + status HTTP corrects
- Cache obligatoire pour appels externes (photos Google)

**Frontend**
- Components : 1 fichier = 1 composant
- Hooks : préfixés `use`, retournent un objet ou primitive
- Pas de logique métier dans les components, déléguer aux hooks
- Styles : StyleSheet en bas du fichier
- Pas de styles inline sauf exception

## Direction UX/UI : Apple-like, épurée, éditoriale

**Principes**
- Beaucoup de blanc, beaucoup d'espace
- Hiérarchie typographique forte
- Photos grandes, bien cadrées
- Animations subtiles (micro-interactions, pas d'effets gratuits)
- Le curateur est toujours visible sur la fiche adresse (c'est l'USP)

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

## Performance : non négociable

- Images : lazy loading, placeholder avant chargement
- Listes : virtualisation (FlatList) dès qu'elles dépassent 20 items
- Animations : react-native-reanimated, toujours sur le thread UI
- Pas de setState en boucle
- Mémoiser les composants lourds
- Debounce sur la recherche
- Cache Redis côté back pour les photos Google

## Règles strictes

- ❌ Ne jamais commiter `.env`, `node_modules/`, ou la clé API Google
- ❌ Pas de `console.log` en production
- ❌ Pas d'emojis dans le code (sauf UI)
- ❌ Pas d'ajout de feature sans validation Romain
- ✅ Toujours tester sur web ET iPhone avant de commiter
- ✅ Commits clairs : "feat: ajout filtre cépage", "fix: panel mobile zoom"
- ✅ Garder l'architecture modulaire (1 responsabilité par fichier)

## Modèle business

Freemium :
- **Gratuit** : carte, recherche ville, fiches, avis
- **Premium 4,99€/mois** : filtres avancés (cépage, pét-nat, orange, biodynamie), offline, listes illimitées, alertes
- **Pro 19,99€/mois** : importateurs, notes privées, export PDF (cavistes, restaurateurs, sommeliers)

## État actuel (avril 2026)

- ✅ Backend Node + PostgreSQL routes CRUD + géolocalisation
- ✅ Environ 2100 adresses importées (à nettoyer — stratégie curation)
- ✅ 64 adresses Lille vérifiées avec photos Google Places
- ✅ App fonctionnelle web + iOS via Expo
- ⏳ Ajout champ `curateur` dans DB
- ⏳ Nettoyage des adresses non validées
- ⏳ Migration Fastify + TypeScript
- ⏳ Cache Redis photos
- ⏳ Auth utilisateurs