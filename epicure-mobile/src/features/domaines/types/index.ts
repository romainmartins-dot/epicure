export interface Domaine {
  id: string;
  nom: string;
  vigneron?: string | null;
  village?: string | null;
  departement?: string | null;
  region?: string | null;
  appellation_principale?: string | null;
  surface_ha?: number | null;
  anciennete_bio?: string | null;
  philosophie?: string | null;
  histoire?: string | null;
  site_web?: string | null;
  photo_url?: string | null;
  curateur_nom?: string | null;
  curateur_id?: string | null;
  statut_donnees?: "complet" | "minimal" | "a-verifier";
}
