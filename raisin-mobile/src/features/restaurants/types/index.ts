export type CarteVinType = "blanc" | "rouge" | "rose" | "petillant" | "doux";

export interface CarteVin {
  cuvee: string;
  domaine: string;
  appellation: string;
  type: CarteVinType;
  millesime: number | null;
  prix_verre: number | null;
  prix_bouteille: number;
}

export interface RestaurantPoc {
  id: number;
  photo_url: string | null;
  carte_vins: CarteVin[];
}
