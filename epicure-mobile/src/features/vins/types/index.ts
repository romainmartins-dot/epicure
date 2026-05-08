export type VinType = "blanc" | "rouge" | "rose" | "petillant" | "doux";
export type VinIntensite = "legere" | "legere-moyenne" | "moyenne" | "moyenne-forte" | "forte";
export type VinNiveau =
  | "amateur"
  | "amateur-eclaire"
  | "gastronomique"
  | "haut-gastronomique"
  | "grand-vin"
  | "vin-nature-avance";

export interface Vin {
  id: string;
  cuvee: string;
  note_curateur?: string | null;
  appellation: string;
  region?: string;
  type: VinType;
  cepage: string | null;
  millesime: number | null;
  millesimes_assemblage?: number[] | null;

  terroir?: string;
  elevage?: string;
  alcool_pct?: number;
  description_courte?: string;
  description_longue?: string;
  accords_mets?: string[];
  service_temperature_c?: string;
  potentiel_garde?: string;
  so2?: string;

  style?: string;
  intensite?: VinIntensite;
  aromes?: string[];
  texture?: string;
  temperature_service?: string;
  temps_ouverture?: string;
  ambiance?: string;
  niveau?: VinNiveau;
  tags?: string[];
}

export interface Domaine {
  id: string;
  nom: string;
  vigneron?: string;
  region?: string;
  appellation_principale?: string;
  village?: string;
  departement?: string;
  surface_ha?: number;
  anciennete_bio?: string;
  philosophie?: string;
  histoire?: string;
  site_web?: string | null;
  photo_url?: string | null;
  curateur_nom?: string | null;
  vins: Vin[];
}
