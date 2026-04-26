export type CarteSectionType = "entree" | "plat" | "dessert";

export interface CartePlat {
  nom: string;
  description: string;
  prix: number;
  section: CarteSectionType;
}

export interface RestaurantPoc {
  id: number;
  photo_url: string | null;
  carte: CartePlat[];
}
