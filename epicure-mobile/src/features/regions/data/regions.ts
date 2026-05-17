export interface Region {
  id: string;
  nom: string;
}

export const REGIONS: Region[] = [
  { id: "bourgogne-et-beaujolais", nom: "Bourgogne et Beaujolais" },
  { id: "vallee-du-rhone", nom: "Vallée du Rhône" },
  { id: "vallee-de-la-loire-et-centre", nom: "Vallée de la Loire et Centre" },
  { id: "champagne", nom: "Champagne" },
  { id: "languedoc-roussillon", nom: "Languedoc-Roussillon" },
  { id: "provence", nom: "Provence" },
  { id: "jura", nom: "Jura" },
  { id: "savoie", nom: "Savoie" },
  { id: "cahors-sud-ouest", nom: "Cahors / Sud-Ouest" },
  { id: "bordeaux", nom: "Bordeaux" },
];

export const REGION_NOM_BY_ID: Record<string, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.nom]),
);
