# Spec carte v1

## User stories

**US1 — Carte plein écran**
En tant qu'utilisateur, j'ouvre l'app et la carte occupe 100% de l'écran sans header, barre de recherche ni légende superposée.
- AC1 : aucun élément UI au-dessus de la carte sauf les contrôles flottants
- AC2 : la carte s'étend sous la status bar (edge-to-edge)

**US2 — Bouton Liste flottant**
En tant qu'utilisateur, je peux basculer vers la liste d'adresses depuis la carte via un bouton flottant en bas à gauche.
- AC1 : bouton "Liste" visible en bas à gauche, au-dessus du safe-area bottom
- AC2 : tap → vue liste. Bouton "Carte" visible en haut à gauche pour revenir.

**US3 — Cluster unique au démarrage**
En tant qu'utilisateur, j'ouvre l'app et vois une seule bulle rouge "19" centrée sur Lille.
- AC1 : 1 seul cluster affiché
- AC2 : le chiffre affiché correspond au nombre total d'adresses (19)
- AC3 : couleur cluster #C0392B

**US4 — Pins teardrop tricolores**
En tant qu'utilisateur, en zoomant je vois des pins individuels en forme de goutte (teardrop) color-codés par type.
- AC1 : forme teardrop (cercle + pointe vers le bas), pas de cercle/flèche Expo Go
- AC2 : Cave → rouge #C0392B
- AC3 : Restaurant → vert #27AE60
- AC4 : Bar → bleu #2980B9
- AC5 : ancre en bas du pin (la pointe touche la coordonnée GPS)
