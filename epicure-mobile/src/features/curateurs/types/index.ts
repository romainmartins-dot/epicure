export interface Curateur {
  id: string;
  nom: string;
  titre: string;
  cave_id: number | null;
  ville: string;
  bio_courte: string | null;
  citation_phare: string | null;
  photo_url: string | null;
  domaines_recommandes: string[];
}
