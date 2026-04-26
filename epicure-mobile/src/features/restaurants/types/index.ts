export type CarteSectionType = "entree" | "plat" | "dessert";
export type VinTypeRestaurant = "blanc" | "rouge" | "rose" | "petillant" | "doux";

export interface CartePlat {
  nom: string;
  description: string;
  prix: number;
  section: CarteSectionType;
}

export interface RestaurantVin {
  id: string;
  domaine: string;
  cuvee: string;
  appellation: string;
  type: VinTypeRestaurant;
  millesime: number | null;
  prix_verre: number | null;
  prix_bouteille: number | null;
  note_curateur: string | null;
}

export interface RestaurantPoc {
  id: number;
  photo_url: string | null;
  carte: CartePlat[];
  reservation_url: string | null;
  telephone: string | null;
  vins: RestaurantVin[];
  description_carte_vins: string | null;
}
