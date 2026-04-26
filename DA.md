# DA.md — Direction Artistique Epicure

Document de référence visuelle.
À relire avant toute mission qui touche l'UI.

---

## 0. Identité

**Nom de l'app** : Epicure
**Tagline interne** : "L'application des meilleurs experts du monde"
**Promesse visuelle** : sobriété Apple, expertise éditoriale, zéro bruit

---

## 1. Philosophie

Epicure suit l'**Apple Human Interface Guidelines** strictement, sans exception décorative.
L'app n'est pas un produit "joli" — elle est **précise**.
Chaque pixel a une raison d'être ou n'a pas sa place.

### Principes non négociables

1. **Clarity** : la lisibilité prime sur tout
2. **Deference** : l'UI s'efface devant le contenu (les vins, les caves, les experts)
3. **Depth** : la hiérarchie crée le sens, pas la décoration

### Anti-patterns interdits

- Aucun gradient
- Aucune ombre custom (uniquement les ombres système iOS si elles existent)
- Aucun emoji dans l'UI (sauf si décision produit explicite documentée)
- Aucune icône custom hors set Apple SF Symbols ou équivalent neutre
- Aucune animation custom non native iOS
- Aucune typo hors SF Pro système
- Aucune couleur hors palette définie ci-dessous

---

## 2. Couleurs

### Palette système iOS uniquement

LABEL PRIMAIRE       #1C1C1E    (texte principal, titres)
LABEL SECONDAIRE     #3C3C43    (texte secondaire)
LABEL TERTIAIRE      #8E8E93    (texte tertiaire, subtitles, hints)
LABEL QUATERNAIRE    #C7C7CC    (chevrons, séparateurs forts, placeholder)

SÉPARATEUR FIN       #C6C6C8    (lignes fines de séparation)
BACKGROUND PRIMAIRE  #FFFFFF    (fond principal)
BACKGROUND SECONDAIRE #F2F2F7   (fond panels, sections, placeholder photo)
BACKGROUND TERTIAIRE #FFFFFF    (fond cards)

### Couleurs sémantiques par type de lieu

CAVE         #C0392B    (rouge profond, élégant)
RESTAURANT   #27AE60    (vert sobre)
BAR          #2980B9    (bleu sobre)
DOMAINE      #6C5B7B    (violet aubergine, distinct)

Ces couleurs sont utilisées **uniquement** pour :
- La pastille de type sur la page cave (taille 10pt, padding 6/3, opacity 0.9)
- Le point couleur 6pt diamètre sur la liste des vins
- Le pin sur la carte (forme Apple teardrop natif)

Jamais en remplissage de bouton, fond de section, accent décoratif.

### Mode sombre

Le mode sombre est **activé** automatiquement par iOS.
Toutes les couleurs ci-dessus ont leur équivalent dark mode iOS natif.

---

## 3. Typographie

### Famille unique : SF Pro (système iOS)

Aucune autre fonte. Pas de Google Fonts, pas de webfonts.

### Échelle typographique

LARGE TITLE       SF Pro Display Bold      34pt   leading 41pt    titres écran
TITLE 1           SF Pro Display Bold      28pt   leading 34pt    titres section domaine
TITLE 2           SF Pro Display Semibold  22pt   leading 28pt    titres section
TITLE 3           SF Pro Display Semibold  20pt   leading 25pt    sous-titres
HEADLINE          SF Pro Text Semibold     17pt   leading 22pt    descriptions courtes en gras
BODY              SF Pro Text Regular      17pt   leading 22pt    texte courant
CALLOUT           SF Pro Text Regular      16pt   leading 21pt    descriptions secondaires
SUBHEADLINE       SF Pro Text Regular      15pt   leading 20pt    metadata (vigneron, village)
FOOTNOTE          SF Pro Text Regular      13pt   leading 18pt    notes
CAPTION 1         SF Pro Text Regular      12pt   leading 16pt    légendes
CAPTION 2 (CAPS)  SF Pro Text Medium       11pt   leading 13pt    labels section (TERROIR, ÉLEVAGE)
                  letterSpacing 0.5pt
                  textTransform uppercase
                  color LABEL TERTIAIRE

### Règles typographiques

- Jamais de centrage de texte sauf cas exceptionnel justifié
- Jamais de soulignement
- Jamais d'italique sauf citation expert ou nom étranger
- Jamais de tout-caps hors CAPTION 2 (labels section)
- Hiérarchie typo > décoration

---

## 4. Espacements

Système 4pt.

4pt    espacement interne tag/pastille
8pt    micro espacement (entre icône et texte)
12pt   espacement entre éléments proches d'un même groupe
16pt   espacement standard texte (paragraphes courts)
20pt   padding horizontal écran (constante)
24pt   espacement entre sections d'info
32pt   espacement entre grandes sections
48pt   espacement bottom écran (avant safe area)

### Padding horizontal écran

**20pt** sur toute l'app, jamais autre. Cohérence absolue.

---

## 5. Composants standards

### Boutons

#### Bouton retour iOS natif (sur photo immersive)

- Forme : cercle 36pt
- Fond : rgba(255, 255, 255, 0.9) avec backdrop-blur 20pt iOS natif
- Icône : chevron-back SF Symbol, 20pt, couleur LABEL PRIMAIRE
- Position : top 16pt + safe area, left 16pt
- Tap area : minimum 44x44pt (HIG)

#### Bouton flottant (Liste, Filtres)

- Forme : pill (rayon 22pt)
- Hauteur : 44pt
- Padding horizontal : 20pt
- Fond : rgba(255, 255, 255, 0.95) avec backdrop-blur 20pt
- Texte : SUBHEADLINE Medium (15pt) couleur LABEL PRIMAIRE
- Icône optionnelle 16pt à gauche du texte avec 6pt de gap
- Position : bottom 24pt + safe area
- Ombre système : shadow: 0 2pt 12pt rgba(0,0,0,0.08) (la seule ombre tolérée)

### Pastilles type (CAVE / RESTAURANT / BAR / DOMAINE)

- Forme : pill (rayon 4pt)
- Hauteur : 20pt
- Padding : 6pt horizontal, 3pt vertical
- Fond : couleur sémantique avec opacity 0.12
- Texte : CAPTION 2 (uppercase, letterSpacing 0.5) couleur sémantique pleine
- Position : juste sous le titre, marge bottom 8pt avant titre

### Séparateurs

- Hauteur : 0.5pt (1px sur écran retina)
- Couleur : SÉPARATEUR FIN (#C6C6C8)
- Inset : 20pt à gauche (alignement avec le contenu)
- Pas de séparateur juste avant un séparateur de section

### Cards

- À éviter au maximum. Apple HIG préfère les listes simples et les groupes flat.
- Si nécessaire :
  - Fond : BACKGROUND SECONDAIRE (#F2F2F7)
  - Rayon : 12pt
  - Padding intérieur : 16pt
  - Pas d'ombre
  - Marge entre cards : 12pt

### Photos

#### Hero immersive (page cave, page vin)

- Ratio : 4:3 ou 3:2 selon contexte
- Full bleed : aucune marge latérale
- Pas de gradient overlay
- Pas de bordure
- Pas de rayon
- Le bouton retour est en absolute par-dessus

#### Placeholder (photo non disponible)

- Fond : BACKGROUND SECONDAIRE (#F2F2F7)
- Icône SF Symbol "wine.bottle" ou neutre, 48pt, couleur LABEL QUATERNAIRE
- Centrée

### ScrollView

- Toujours contentContainerStyle={{ paddingBottom: 48 }}
- showsVerticalScrollIndicator={true} (Apple natif)
- bounces={true} (comportement iOS standard)

---

## 6. Iconographie

### Set unique : SF Symbols (Apple)

Via @expo/vector-icons → Ionicons compatible iOS minimal, ou directement react-native-sf-symbols si dispo.

Set restreint autorisé :

chevron-back        retour
chevron-forward     navigation
location            géoloc
list                vue liste
map                 vue carte
search              recherche
xmark               fermer
heart               favori (futur)
heart.fill          favori actif (futur)

### Tailles

- 16pt : icône inline texte
- 20pt : icône bouton retour
- 24pt : icône bouton standard
- 32pt+ : icône hero illustrative

### Règle

**Aucune icône custom, aucune illustration vectorielle ajoutée.**

---

## 7. Animations

### Système : transitions iOS natives uniquement

Push iOS                  duration 350ms, ease-out
Pop iOS                   duration 350ms, ease-out
Modal présent             duration 400ms, spring iOS native
Modal dismiss             duration 350ms, ease-in
Fade-in chargement        duration 300ms, ease-out

### Animations interdites

- Bounce custom
- Wobble, shake, pulse
- Parallaxe sur scroll (sauf cas Apple Maps natif sur photo header)
- Loaders custom (utiliser ActivityIndicator natif)

### Performance

60fps minimum sur toutes les transitions.
Si une transition saccade : on simplifie l'écran, pas l'inverse.

---

## 8. Photos et imagerie

### Style éditorial

- Photos lumineuses, contraste naturel
- Pas de filtre, pas de teinte custom
- Pas de noir et blanc systématique
- Photos d'ambiance (vignobles, intérieurs caves) > photos produits
- **Aucune photo de bouteille en gros plan** (datée, e-commerce)

### Sources

- V1 démo : Unsplash libres de droits ("vignoble Bourgogne", "wine cellar")
- V2+ : photos sourced auprès des domaines / experts curateurs

### Format technique

- WebP ou JPEG optimisé, max 800KB par photo
- Cache disque iOS natif (expo-image avec cachePolicy="disk")

---

## 9. Voix et ton (microcopy)

### Principe

Epicure parle comme un caviste expert, pas comme un site marketing.

### Bons exemples

- "Cave à vins naturels, très bon conseil"
- "Aucune filtration ni collage"
- "Vendanges manuelles, levures indigènes"

### Mauvais exemples

- "Découvrez nos meilleures pépites !"
- "Le top 10 des caves de Lille"
- "Vous allez adorer ce vin"

### Règles

- Toujours en français
- Tutoiement jamais
- Jamais d'exclamation
- Jamais de "découvrir", "explorer", "tester"
- Privilégier les phrases courtes et sobres

---

## 10. Mode sombre

L'app respecte le mode sombre iOS automatiquement.

Tous les composants utilisent les couleurs adaptive d'iOS via React Native :
Colors.label, Colors.secondaryLabel, Colors.tertiaryLabel, Colors.quaternaryLabel,
Colors.systemBackground, Colors.secondarySystemBackground, Colors.tertiarySystemBackground,
Colors.systemFill, Colors.secondarySystemFill, Colors.separator, Colors.opaqueSeparator.

Les couleurs sémantiques (CAVE, RESTAURANT, BAR, DOMAINE) restent identiques en dark mode car elles sont des accents de marque.

---

## 11. Accessibilité

- Contrastes : minimum WCAG AA (4.5:1) pour le texte courant
- Tailles tap : minimum 44x44pt
- Dynamic Type : supporter les tailles utilisateur (allowFontScaling={true})
- VoiceOver : tous les éléments interactifs ont un accessibilityLabel clair
- Couleur jamais seule pour véhiculer une info

---

## 12. Composants spécifiques Epicure

### Page Carte

- Carte plein écran (Apple Maps natif)
- Pin Apple teardrop natif (couleur sémantique selon type)
- Cluster Apple-style avec count
- Bouton flottant "Liste" en bas-gauche
- Aucun overlay (pas de SearchBar, pas de Header, pas de Légende en flottant en V1)

### Page Cave

- Photo hero immersive (full bleed, ratio 4:3)
- Bouton retour flottant
- Pastille type
- Titre LARGE TITLE (Nom)
- Subtitle SUBHEADLINE LABEL TERTIAIRE (adresse)
- Description BODY
- Section "Vins disponibles" :
  - Header TITLE 2 + subtitle SUBHEADLINE vigneron · village
  - Liste compacte de cuvées
  - Séparateurs fins entre cuvées
  - Espace 32pt entre 2 sections domaine

### Page Vin

- Photo hero immersive du DOMAINE (vignoble, vigneron au travail)
- Bouton retour flottant
- LARGE TITLE (cuvée)
- SUBHEADLINE LABEL TERTIAIRE (appellation · millésime ou Assemblage)
- Domaine link CALLOUT tappable (nom + vigneron · village)
- Séparateur fin
- HEADLINE description courte en gras
- Séparateur fin
- Sections successives :
  - CAPTION 2 (label CAPS) + BODY (contenu)
  - Sections : TERROIR · ÉLEVAGE · EN BOUCHE · CÉPAGE · ACCORDS · SERVICE · SO₂ (si applicable)
- Padding bottom 48pt

---

## 13. Exemples concrets de styles React Native

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 48 },
  paddingHorizontal: { paddingHorizontal: 20 },

  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: "700", color: "#1C1C1E", letterSpacing: 0.37 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "600", color: "#1C1C1E" },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600", color: "#1C1C1E" },
  body: { fontSize: 17, lineHeight: 22, fontWeight: "400", color: "#1C1C1E" },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: "400", color: "#1C1C1E" },
  caption2Caps: { fontSize: 11, lineHeight: 13, fontWeight: "500", color: "#8E8E93", letterSpacing: 0.5, textTransform: "uppercase" },

  caveColor: { color: "#C0392B" },
  restaurantColor: { color: "#27AE60" },
  barColor: { color: "#2980B9" },
  domaineColor: { color: "#6C5B7B" },

  typeBadge: { alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  typeBadgeText: { fontSize: 11, fontWeight: "500", letterSpacing: 0.5, textTransform: "uppercase" },

  separator: { height: 0.5, backgroundColor: "#C6C6C8", marginLeft: 20 },

  backButton: {
    position: "absolute", top: 16, left: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center", justifyContent: "center",
  },
});

---

## 14. Règle de gouvernance DA

**Toute modification de ce document = décision produit explicite Romain.**
Claude Code n'a pas le droit de modifier DA.md sans validation.

Si une demande de feature implique de violer une règle DA :
1. Claude Code stoppe
2. Documente le conflit dans BLOCKERS.md
3. Demande à Romain de trancher

---

## 15. Checklist DA pour chaque PR UI

Avant chaque PR qui touche l'UI, vérifier :

- [ ] Toutes les couleurs utilisées sont dans la palette
- [ ] Toute la typo utilise SF Pro avec les tailles standardisées
- [ ] Tous les espacements suivent le système 4pt
- [ ] Padding horizontal écran = 20pt partout
- [ ] Aucun gradient, aucune ombre custom (sauf bouton flottant)
- [ ] Aucun emoji, aucune icône hors set autorisé
- [ ] Aucune animation custom non native
- [ ] Mode sombre supporté (couleurs adaptive ou test manuel)
- [ ] Tap areas ≥ 44pt
- [ ] Microcopy respecte la voix Epicure (sobre, factuel, pas marketing)

Si une case n'est pas cochée : retravail requis avant merge.

Fin du document.
