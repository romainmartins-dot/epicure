import domainesData from "../data/domaines.json";
import { Domaine } from "../types";

const ALL: Domaine[] = domainesData.domaines as Domaine[];

export function getAllDomaines(): Domaine[] {
  return ALL;
}

export function getDomaineById(id: string): Domaine | null {
  return ALL.find((d) => d.id === id) ?? null;
}

export function getDomainesByRegion(region: string): Domaine[] {
  return ALL.filter((d) => d.region === region);
}

export function getDomainesByCurateur(curateurId: string): Domaine[] {
  return ALL.filter((d) => d.curateur_id === curateurId);
}
