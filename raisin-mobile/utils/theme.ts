// Epicure — Design System v0.1
// Source de vérité pour toute l'UI. Ne jamais hardcoder couleurs/typo ailleurs.

export const colors = {
  // Neutres
  black: "#111111",
  grey1: "#444444",
  grey2: "#777777",
  grey3: "#AAAAAA",
  grey4: "#D5D5D5",
  cream: "#F5F2EE",
  white: "#FFFFFF",

  // Surfaces flottantes (header, search, chips)
  blur: "rgba(245,242,238,0.90)",
  overlay: "rgba(0,0,0,0.28)",

  // Types d'établissement — palette Epicure, plus profonde que les primaires
  cave: "#7A1728",
  restaurant: "#2A5C45",
  bar: "#243D6B",

  // Feedback / cluster
  cluster: "#7A1728",
} as const;

export const typo = {
  title: { fontSize: 17, fontWeight: "600" as const, letterSpacing: 0.3 },
  body: { fontSize: 15, fontWeight: "400" as const, letterSpacing: 0 },
  label: { fontSize: 13, fontWeight: "500" as const, letterSpacing: 0.1 },
  meta: { fontSize: 11, fontWeight: "400" as const, letterSpacing: 0.2 },
  pin: { fontSize: 10, fontWeight: "600" as const, letterSpacing: 0.15 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  pill: 9999,
  card: 20,
  button: 14,
  chip: 20,
  tag: 8,
} as const;

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
} as const;

// Couleur par type — remplace typeCouleur() progressivement
export const typeColor = (type: string): string =>
  type === "cave" ? colors.cave : type === "restaurant" ? colors.restaurant : colors.bar;
