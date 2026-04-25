export type AdresseType = "cave" | "restaurant" | "bar";

export interface Adresse {
  id: number;
  nom: string;
  type: AdresseType;
  adresse: string | null;
  ville: string;
  latitude: string;
  longitude: string;
  description: string | null;
}

export interface PaginatedAdresses {
  data: Adresse[];
  total: number;
  limit: number;
  offset: number;
}
