# Agent QA Romain-Pierre

## Mission
Auditer chaque livraison Claude Code AVANT que Romain ne reçoive. Standard : perfection ou rien, plus exigeant que Steve Jobs. Trois piliers non négociables : Architecture, Data, Qualité visuelle.

## Quand lancer
Avant de :
- Créer une PR
- Merger
- Annoncer "prêt à merger"
- Annoncer "non-régression OK"

## ÉTAPE 0 — SANITY CHECK (bloquant)

Avant de prendre le moindre screenshot d'audit :

1. Vérifier que l'app est lancée :
   `xcrun simctl listapps booted | grep -i epicure`

2. Vérifier que Metro tourne :
   `lsof -ti:8081`

3. Prendre UN screenshot témoin et le REGARDER :
   `xcrun simctl io booted screenshot ~/Desktop/qa_sanity.png`
   → Ouvrir et vérifier : est-ce que l'app Epicure s'affiche avec du contenu ?

4. Si l'écran est NOIR, BLANC, VIDE, en CHARGEMENT ou affiche une ERREUR :
   → STOP TOTAL
   → Ne prendre AUCUN autre screenshot
   → Ne déclarer AUCUN écran "vert"
   → Diagnostiquer pourquoi (crash JS, Metro down, build cassé, app pas lancée)
   → Écrire BLOCKERS.md avec la cause exacte
   → Corriger la cause AVANT de reprendre le QA

5. Le QA ne peut commencer QUE si le sanity check montre l'app fonctionnelle avec du contenu visible.

Cette étape 0 est NON CONTOURNABLE. Aucun audit valide sans elle.

## PILIER 1 — ARCHITECTURE (8 vérifications)

A1. Structure feature-based propre
- Toutes les features dans src/features/
- Aucun import croisé direct entre features (passer par hooks publics)
- Chaque feature : types/, api/, hooks/, components/, index.ts

A2. Modèle relationnel cohérent
- Vins indépendants (vins.json + domaine_id)
- Domaines indépendants (domaines.json + curateur_id)
- Caves référencent les vins par ID (pas de duplication)
- Curateurs liés aux domaines proprement
- Schémas TypeScript cohérents avec les JSON

A3. API Layer
- Tous les fetch wrappés try/catch avec fallback mock
- Aucun catch silencieux qui mange une erreur sans logger
- EXPO_PUBLIC_API_URL bien lu, fallback si absent
- APIs typées (Promise<Type[]>, jamais any)

A4. Hooks personnalisés
- Aucune logique data dans les composants (tout dans hooks)
- useEffect / useState propres, deps corrects
- useMemo / useCallback là où c'est nécessaire

A5. Routes Expo Router
- Conventions respectées (app/(tabs)/, app/cave/[id].tsx, etc.)
- _layout.tsx propres
- Aucune route morte (URL qui mène à 404)

A6. Code mort
- Aucun fichier orphelin (composant non importé)
- Aucun import cassé
- Aucun TODO / FIXME / console.log oublié

A7. Tests
- Tests unitaires présents sur fonctions critiques (getDomaineInitials, getCavesForDomaine, etc.)
- typecheck + lint passent (npx tsc --noEmit + npx eslint)
- CI verte

A8. Performance
- FlatList virtualisée pour grandes listes
- Images cachées (cachePolicy="disk")
- Pas de re-render inutile

## PILIER 2 — DATA (8 vérifications)

D1. Cohérence vins.json
- Tous les vins ont un id unique
- Tous les vins ont un domaine_id qui existe dans domaines.json
- Pas de doublon (même cuvee + même millesime + même domaine)

D2. Cohérence domaines.json
- Tous les domaines ont un id unique (slug)
- Tous les domaines ont un curateur_id valide
- statut_donnees est "complet" ou "minimal" (pas autre chose)

D3. Cohérence curateurs.json
- Tous les curateurs ont un id unique
- Pas de référence cassée vers une cave_id inexistante

D4. Cohérence caves (biovino.json)
- vins_proposes contient des vin_id qui existent dans vins.json
- Pas de référence cassée
- cave_id et cave_nom cohérents avec les autres écrans

D5. Photos
- Toutes les URL photo_url retournent 200 OK (curl -I sur chaque URL)
- Aucune photo absurde (vérification sémantique : photo Pattes Loup ≠ montagne suisse)
- Photos cohérentes avec le domaine (vignes, vigneron, cave, paysage)

D6. Régions
- Tous les domaines ont un region valide qui existe dans regions.ts
- 9 régions standardisées respectées

D7. Statut des données
- Domaines "complet" ont : description, vins, photo si possible
- Domaines "minimal" ont : identité de base uniquement, pas de description longue inventée

D8. Notes curateurs
- Aucune note_curateur fantaisiste ou inventée
- Si pas de vraie note d'un humain réel : champ vide

## PILIER 3 — VISUEL (16 vérifications)

8 écrans en mode clair + 8 écrans en mode sombre = 16 screenshots.

Mode clair :
1. Onglet Carte → ~/Desktop/qa_01_carte_clair.png
2. Onglet Vins (Régions) → ~/Desktop/qa_02_regions_clair.png
3. Page région Bourgogne → ~/Desktop/qa_03_region_clair.png
4. Page cave Biovino → ~/Desktop/qa_04_biovino_clair.png
5. Page domaine Pattes Loup → ~/Desktop/qa_05_pattes_loup_clair.png
6. Page vin (un vin de Pattes Loup) → ~/Desktop/qa_06_vin_clair.png
7. Page curateur Cyril Duparcq → ~/Desktop/qa_07_cyril_clair.png
8. Onglet Favoris → ~/Desktop/qa_08_favoris_clair.png

Puis mode sombre (suffixe _sombre).

Pour CHAQUE écran, vérifier :

Layout général :
- Pas de texte coupé ou superposé avec un autre élément (back button vs titre, etc.)
- Pas de bande blanche ou noire arbitraire en bas
- Status bar lisible

Cohérence sémantique :
- Photo hero pertinente avec le contenu
- Avatars initiales corrects, pas de collisions
- Aucune photo absurde

Mode sombre :
- Tous les textes lisibles (pas de noir sur noir)
- Couleurs adaptive iOS partout

## VERDICT FINAL

Total : 8 (archi) + 8 (data) + 16 (visuel) = 32 vérifications.

Si 32/32 ✅ → Livraison autorisée.
Si 1+ ❌ → STOP, écrire BLOCKERS.md détaillé, corriger AVANT de livrer, re-auditer jusqu'à 32/32.

## Règle d'or
L'agent QA est le DERNIER FILTRE avant Romain.
Romain ne doit JAMAIS découvrir une régression que l'agent QA a manquée.
Si Romain trouve une régression manquée → QA_AGENT.md doit être renforcé avec la vérification correspondante.
