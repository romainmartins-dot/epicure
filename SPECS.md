# SPECS.md — Livre blanc Epicure

Document source de vérité.
À LIRE INTÉGRALEMENT avant toute mission de code, refactor ou QA.
À METTRE À JOUR à chaque ajout/modification de fonctionnalité.

Dernière révision : 2026-05-09

---

## TABLE DES MATIÈRES

1. Architecture data
2. Modèle relationnel
3. Écrans et navigation
4. Fonctionnalités par écran
5. Comportements transverses
6. Données externes (API, AsyncStorage)
7. Checklist de QA non-régression OBLIGATOIRE

---

## 1. ARCHITECTURE DATA

### Sources de données
- **Backend API** : `http://192.168.1.20:3000` (machine Mac dev), endpoints `/adresses`, `/cave_domains`, etc.
- **Mock fallback** : si API injoignable → mock JSON local
- **Fichiers JSON locaux** :
  - `src/features/vins/data/vins.json` → catalogue maître des vins (entité indépendante)
  - `src/features/domaines/data/domaines.json` → catalogue maître des domaines
  - `src/features/vins/data/caves/biovino.json` → identité cave + liste vins_proposes
  - `src/features/curateurs/data/curateurs.json` → curateurs (Cyril Duparcq + L'équipe Epicure)
  - `src/features/regions/data/regions.ts` → 9 régions de France

### Relations
- Un vin a un `domaine_id` → relation 1:N (un domaine → plusieurs vins)
- Une cave a une liste `vins_proposes[]` avec `vin_id` → relation N:N
- Un domaine a un `curateur_id` → relation 1:1
- Un curateur a une `cave_id` (optionnelle) → relation 1:1 (Cyril → Biovino)
- Une région est un attribut texte du domaine (pas une entité forte en V1)

### Stockage local
- AsyncStorage clé `epicure.favorites.vins.v1` → liste d'IDs de vins favoris

---

## 2. MODÈLE DES ENTITÉS

### Vin
```ts
interface Vin {
  id: string                                    // ex: "pattes-loup-vent-ange-2020"
  domaine_id: string                            // ref vers Domaine
  cuvee: string
  appellation: string
  region: string                                // doit matcher une des 9 régions
  type: "blanc" | "rouge" | "rose" | "petillant" | "doux"
  cepage: string
  millesime: number | null
  millesimes_assemblage?: number[]              // si pas de millésime unique

  // données enrichies (optionnelles, peuvent être null)
  terroir?: string
  elevage?: string
  alcool_pct?: number
  description_courte?: string
  description_longue?: string
  accords_mets?: string[]
  service_temperature_c?: string
  potentiel_garde?: string
  so2?: string

  // champs enrichissement
  style?: string
  intensite?: "legere" | "legere-moyenne" | "moyenne" | "moyenne-forte" | "forte"
  aromes?: string[]
  texture?: string
  temperature_service?: string
  temps_ouverture?: string
  ambiance?: string
  niveau?: "amateur" | "amateur-eclaire" | "gastronomique" | "haut-gastronomique" | "grand-vin" | "vin-nature-avance"
  tags?: string[]

  // Note curateur — null par défaut, à remplir manuellement
  note_curateur?: string | null
  auteur_note?: string | null
}
```

### Domaine
```ts
interface Domaine {
  id: string
  nom: string
  vigneron: string | null
  village: string | null
  departement: string | null
  region: string                                // une des 9 régions
  appellation_principale: string | null
  pays: string                                  // "France" par défaut
  surface_ha: number | null
  certification: "bio" | "biodynamique" | "nature" | "conventionnel" | null
  anciennete_certification: string | null
  philosophie_courte: string | null
  philosophie_longue: string | null
  histoire: string | null
  site_web: string | null
  curateur_id: string | null                    // qui l'a sélectionné
  statut_donnees: "complet" | "minimal" | "a-verifier"
}
```

### Cave (et autres adresses : restaurant, bar)
```ts
interface Adresse {
  id: number
  nom: string
  type: "cave" | "restaurant" | "bar"
  adresse: string
  ville: string
  latitude: string                              // string parseable
  longitude: string                             // string parseable
  description: string | null
  vins_proposes?: { vin_id: string, disponible: boolean, prix?: number }[]
}
```

### Curateur
```ts
interface Curateur {
  id: string                                    // ex: "cyril-duparcq", "equipe-epicure"
  nom: string
  titre: string                                 // ex: "Caviste", "Fondateur"
  ville: string
  cave_id: number | null                        // null pour L'équipe Epicure
  bio_courte: string | null
  citation_phare: string | null
  photo_url: string | null
  domaines_recommandes: string[]                // liste IDs de domaines
}
```

---

## 3. ÉCRANS ET NAVIGATION

### Tab bar (3 onglets en bas)
- Onglet 1 : **Carte** — icône map / map-outline
- Onglet 2 : **Vins** — icône wine / wine-outline
- Onglet 3 : **Favoris** — icône heart / heart-outline

### Routes
- `/` → `app/(tabs)/index.tsx` → écran Carte
- `/(tabs)/vins` → écran Régions (navigation vins par région)
- `/(tabs)/favoris` → écran Favoris
- `/cave/[id]` → fiche cave
- `/vin/[id]` → fiche vin
- `/curateur/[id]` → page profil curateur
- `/domaine/[id]` → page profil domaine
- `/region/[id]` → liste des domaines d'une région

---

## 4. FONCTIONNALITÉS PAR ÉCRAN

### 4.1 Écran Carte (onglet 1)

**Données affichées**
- Carte Apple Maps natif via `react-native-maps` (`provider={null}`)
- Pins de toutes les adresses (caves, restaurants, bars) issues de `useAdresses()`
- Clustering natif react-native-map-clustering quand vue large
- Pins custom rouge bordeaux avec label

**Fonctionnalités**
- Search bar en haut "Rechercher une ville..."
- Zoom / pan natif Apple
- Tap sur pin → `onMarkerClick` → navigation `/cave/[id]` ou `/restaurant/[id]`

**Comportement attendu**
- Si API injoignable : mock 19 adresses (Biovino + autres caves Lille)
- Si API joignable : ~21 adresses depuis backend
- JAMAIS 0 pins — erreur réseau DOIT fallback sur mock

**Régressions à éviter**
- ❌ Carte vide sans pins
- ❌ Tap pin sans navigation
- ❌ Crash au scroll/zoom

### 4.2 Écran Vins / Régions (onglet 2)

**Layout**
- LARGE TITLE 34pt fontWeight 700 : "Vins"
- Sous-titre 15pt #8E8E93 : "{N} domaines · 9 régions" (counts dynamiques)
- Search bar iOS style
- Section "PAR RÉGION" en caps
- Liste des 9 régions : Bourgogne et Beaujolais, Vallée du Rhône, Vallée de la Loire et Centre, Champagne, Languedoc-Roussillon, Provence, Jura, Savoie, Cahors / Sud-Ouest
- Chaque ligne : nom + count domaines + chevron

**Comportement search**
- Filtrage temps réel sur nom, vigneron, région, appellation, village
- Insensible casse + accents (NFD normalize)
- Liste régions masquée pendant recherche, résultats à plat
- "Annuler" → reset

**Régressions à éviter**
- ❌ Counts à 0 alors que des domaines existent
- ❌ Search qui ne filtre pas
- ❌ Tap région sans navigation
- ❌ Liste qui ne scroll pas (problème flex)

### 4.3 Page Région `/region/[id]`

**Layout**
- Bouton retour iOS
- Nom de la région en LARGE TITLE
- Sous-titre : "{N} domaines"
- Liste alphabétique des domaines
- Chaque ligne : pastille initiale + nom + vigneron · village + chevron

**Fonctionnalités**
- Tap domaine → `/domaine/[id]`

**Régressions à éviter**
- ❌ Liste vide alors que la région a des domaines
- ❌ Tap domaine sans navigation

### 4.4 Page Domaine `/domaine/[id]`

**Si `statut_donnees = "complet"` (~12 domaines originaux)**
- Photo hero ou bloc identité typo
- LARGE TITLE 34pt : nom domaine
- 15pt #8E8E93 : "{vigneron} · {village}"
- 13pt : "{appellation_principale} · {region}"
- Description courte en headline
- Section "Vins disponibles" → `useVinsByDomaine(id)`
- Footer signature curateur

**Si `statut_donnees = "minimal"` (~50 nouveaux)**
- Bloc identité typo : fond #F2F2F7 hauteur 200pt, initiale 64pt centrée
- LARGE TITLE 34pt : nom domaine
- 15pt : vigneron · village (si présents)
- Citation HEADLINE 22pt italique de l'équipe Epicure
- Footer signature "— L'équipe Epicure / Fondateur · Lille"

**Régressions à éviter**
- ❌ Photo Unsplash décorative inventée
- ❌ Description longue inventée
- ❌ Note curateur inventée
- ❌ Vins affichés en double

### 4.5 Page Cave `/cave/[id]` (ex Biovino)

**Layout**
- Photo hero full bleed
- Nav bar scroll-aware (titre apparaît au scroll)
- Bouton retour avec haptic
- Pastille CAVE rouge bordeaux
- LARGE TITLE 34pt : nom cave
- 15pt #8E8E93 : adresse complète
- Description éditoriale
- Signature curateur
- Section "RÉFÉRENCÉS" en caps
- Liste alphabétique des domaines de la cave
- Chaque ligne : nom + vigneron · village + count vins + chevron

**Fonctionnalités**
- Tap signature → `/curateur/[id]`
- Tap domaine → `/domaine/[id]`
- Haptic light sur tap row

**Régressions à éviter**
- ❌ Photo coupée par status bar
- ❌ Bouton retour mal placé
- ❌ Domaines en doublon
- ❌ Wrong count vins par domaine

### 4.6 Page Vin `/vin/[id]`

**Layout**
- Photo hero du domaine (vignoble)
- Bouton retour + bouton favori (cœur) top-right
- LARGE TITLE 34pt : cuvée
- 15pt #8E8E93 : "{appellation} · {millésime}"
- Lien domaine tappable → `/domaine/[id]`
- Description courte en headline
- Sections selon données disponibles : TERROIR, ÉLEVAGE, EN BOUCHE, CÉPAGE, ACCORDS, SERVICE, SO₂

**Fonctionnalités**
- Bouton favori → toggle AsyncStorage + animation scale + haptic + couleur #FF3B30
- Tap domaine → `/domaine/[id]`

**Régressions à éviter**
- ❌ Champs affichés alors qu'ils sont null
- ❌ Bouton favori qui ne persiste pas
- ❌ Animation cœur incorrecte

### 4.7 Page Curateur `/curateur/[id]`

**Cyril Duparcq** (cave_id non null)
- Bloc identité (initiales "CD" 64pt si pas de photo)
- LARGE TITLE 34pt : "Cyril Duparcq"
- 15pt #8E8E93 : "Caviste"
- 13pt : "Biovino — Lille"
- Section PORTRAIT : bio_courte
- Citation phare HEADLINE 22pt italique
- Section RECOMMANDATIONS : domaines recommandés

**L'équipe Epicure** (cave_id null)
- Initiales "EE" 64pt
- LARGE TITLE 34pt : "L'équipe Epicure"
- 15pt : "Fondateur · Lille"
- Section PORTRAIT : bio_courte
- Citation phare
- Section RECOMMANDATIONS : domaines avec curateur_id="equipe-epicure"

**Régressions à éviter**
- ❌ "Caviste, [Cave]" affiché alors que cave_id est null
- ❌ Photo Unsplash inventée
- ❌ Bio inventée

### 4.8 Écran Favoris (onglet 3)

**Layout**
- LARGE TITLE 34pt : "Mes favoris"
- 15pt #8E8E93 : "{N} vin sauvegardé" / "{N} vins sauvegardés"
- Liste des vins favoris (AsyncStorage + hydratés via vins.json)
- Tap → `/vin/[id]`

**État vide**
- Message centré : "Aucun favori"
- Sous-titre : "Touchez le cœur sur une fiche vin pour la sauvegarder ici"

**Régressions à éviter**
- ❌ Favoris non persistés après fermeture app
- ❌ Cœur désynchronisé entre fiche vin et écran Favoris

---

## 5. COMPORTEMENTS TRANSVERSES

### Mode sombre
- Tous les écrans supportent le mode sombre iOS automatiquement
- Couleurs sémantiques iOS adaptive
- Couleurs métier (cave rouge, restaurant vert, bar bleu) identiques en light/dark

### Animations
- Push iOS native uniquement
- Pas d'animation custom hors standards iOS

### Haptic feedback
- Tap row de liste : `Haptics.impactAsync(Light)`
- Tap bouton favori : `Haptics.impactAsync(Light)`

### Search bar
- Pattern iOS UISearchBar natif
- Pull-down pour révéler
- Bouton "Annuler" iOS
- Insensible casse + accents (NFD)

### Photos
- `expo-image` avec `cachePolicy="disk"`
- Aucune photo Unsplash décorative pour domaines/vins minimaux
- Placeholder typo si pas de photo

### Network errors
- TOUJOURS try/catch autour de fetch
- Fallback mock obligatoire si API injoignable
- JAMAIS de catch silencieux sans fallback

---

## 6. DONNÉES EXTERNES

### API Backend
- URL : `EXPO_PUBLIC_API_URL` dans `.env` (défaut `http://192.168.1.20:3000`)
- Endpoints actifs :
  - `GET /adresses?limit=500` → liste des adresses (caves, restaurants, bars)
  - `GET /adresses/[id]` → détail adresse
  - `GET /adresses/[id]/photo` → photo Google Places

### Mock fallback obligatoire
- Si fetch échoue ou retourne non-200 → `return mock`
- Mock minimum : 19 adresses (Biovino + ~18 autres adresses Lille)

### AsyncStorage
- Clé `epicure.favorites.vins.v1` → string[] (IDs vins favoris)
- Lecture/écriture toujours wrappée try/catch

---

## 7. CHECKLIST DE QA NON-RÉGRESSION OBLIGATOIRE

**Avant TOUTE déclaration de "non-régression OK", DOIVENT être testés visuellement (screenshots) :**

### Smoke test minimum
1. Onglet Carte → pins visibles (≥19 si mock, ≥21 si API)
2. Onglet Vins → liste 9 régions + counts > 0
3. Onglet Favoris → écran rendu (vide ou avec favoris)

### Tests par écran
4. Tap pin sur carte → ouvre `/cave/[id]` ou `/restaurant/[id]`
5. Page Biovino → photo + titre + signature Cyril + liste domaines
6. Tap signature Cyril → `/curateur/cyril-duparcq`
7. Tap domaine sur page cave → page domaine
8. Tap vin → `/vin/[id]` avec sections correctement affichées
9. Tap cœur sur page vin → animation + haptic + persiste après reload
10. Onglet Vins → tap région Bourgogne → liste domaines
11. Tap domaine minimal → page avec bloc typo + signature Equipe Epicure
12. Tap domaine complet (Pattes Loup) → page avec description + vins

### Tests transverses
13. Mode sombre activé → tous les écrans ci-dessus restent corrects
14. API coupée → fallback mock, carte affiche les pins
15. Search bar → tape "chab" → résultats filtrés temps réel

**Si UNE seule de ces 15 cases n'est pas validée par screenshot lu à l'instant T : la PR n'est PAS mergeable.**

---

## 8. INTERDICTIONS DURES (anti-régression)

- ❌ Inventer une description longue pour un domaine ou un vin
- ❌ Inventer une note curateur
- ❌ Ajouter une photo Unsplash décorative pour boucher un placeholder
- ❌ Catch silencieux d'erreur réseau sans fallback mock
- ❌ Modifier une fonctionnalité sans la tester avec smoke test + écran spécifique
- ❌ Déclarer "non-régression OK" sans avoir fait les 15 checks ci-dessus
- ❌ Supprimer un fichier JSON sans vérifier qu'aucun composant ne le lit encore
- ❌ Renommer un champ sans migrer toutes les utilisations

---

## 9. ÉVOLUTION DU DOCUMENT

Ce document doit être mis à jour à CHAQUE PR qui :
- Ajoute un écran
- Modifie un comportement majeur
- Ajoute/modifie un champ data
- Change une route
- Ajoute une fonctionnalité utilisateur

La PR doit inclure la mise à jour de SPECS.md dans le même commit.

Si SPECS.md n'est pas à jour : la PR n'est pas mergeable.
