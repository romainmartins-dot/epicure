export interface Vin {
  id: number;
  cave_id: number;
  domaine: string;
  vigneron: string;
  cuvee: string;
  millesime: number;
  so2_libre: string | null;
  so2_total: string | null;
  mise: string | null;
  description: string | null;
  accords: string[];
}
