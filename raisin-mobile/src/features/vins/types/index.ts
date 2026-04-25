export type VinType = "blanc" | "rouge" | "rose" | "petillant" | "doux";

export interface Vin {
  id: string;
  cuvee: string;
  appellation: string;
  type: VinType;
  millesime: number | null;
  millesimes_assemblage?: number[];
  cepage: string;
  terroir: string;
  elevage: string;
  alcool_pct: number;
  description_courte: string;
  description_longue: string;
  accords_mets: string[];
  service_temperature_c: string;
  potentiel_garde: string;
  so2: string;
}

export interface Domaine {
  id: string;
  nom: string;
  vigneron: string;
  region: string;
  appellation_principale: string;
  village: string;
  departement: string;
  surface_ha: number;
  anciennete_bio: string;
  philosophie: string;
  histoire: string;
  site_web: string | null;
  vins: Vin[];
}
