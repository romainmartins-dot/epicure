# Overnight Report — 2026-04-21

## Fait

- **Clustering Apple-style** : `ClusteredMapView` (react-native-map-clustering) intégré dans `MapNative.tsx`. Une seule bulle "19" au démarrage, scission progressive au zoom.
- **Config `initialRegion`** : `latitudeDelta: 0.35` garantit zoom 10 → 1 cluster à l'ouverture. Validé mathématiquement et visuellement.
- **Architecture Netflix scaffold** : dossiers `src/features/`, `src/shared/`, `src/store/`, `src/config/` créés. `ARCHI.md` à la racine.
- **Mock-first service layer** : `services/adresses.ts` et `services/photos.ts` utilisent `EXPO_PUBLIC_API_URL` — si absent, les 19 adresses mock Lille sont servies. Zéro dépendance backend pour le dev.
- **Code pourri supprimé** : `config.ts` avec IP hardcodée 192.168.1.20 effacé définitivement.
- **Tests Jest (8/8)** : données mock, service mock mode, invariants clustering — tous verts.
- **CI verte (PR #15)** : API pass + Mobile typecheck/lint/format pass.
- **Test visuel iPhone 17 Pro** :
  - Zoom large (delta=0.35) → 1 bulle "19" ✅
  - Zoom moyen (delta=0.08) → scission 3+2+13 ✅
  - Zoom rue (delta=0.025) → pins individuels ✅

## Non fait

- **Tests multi-devices automatisés** : SE3, iPhone 14, iPhone 14 Pro Max bloqués par le dialog iOS "Ouvrir dans Expo Go ?" — impossible à automatiser sans permission Accessibility dans System Preferences (barrière macOS, pas un bug code).
- **iPhone 14 Plus** : app ouverte mais test de startup non validé (map en état zoomed-in au moment du screenshot).
- **Migration code dans `src/features/`** (PR C) : scaffold créé, migration elle-même non faite.
- **RTK Query** : implémenté puis revert dans le clean slate — hors périmètre de cette PR.

## Limitations connues

- `initialRegion` est une prop fire-and-forget : le hot reload ne la réapplique pas. Les tests de zoom nécessitent des cold restarts.
- Le dialog "Ouvrir dans Expo Go?" sur simulateurs neufs est une friction one-time — après le premier "Ouvrir", les `openurl` suivants s'ouvrent directement.

## Instructions merge (Romain)

1. **PR #15** (`chore/archi-netflix-scaffold`) est prête à merger : CI verte, code propre.
2. Pour valider multi-devices : ouvrir le Simulator, cliquer "Ouvrir" une fois sur chaque device (SE3, 14, 14 Plus, 14 Pro Max), puis lancer `xcrun simctl openurl <UDID> "exp://127.0.0.1:8081"` — le comportement sera identique à iPhone 17 Pro (même bundle JS).
3. La PR originale #14 a été fermée dans le clean slate — tout son contenu utile est dans PR #15.
