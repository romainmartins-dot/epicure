import { getDomaineById } from "../../domaines/api/domainesApi";
import { Domaine, Vin } from "../types";
import biovinoData from "./caves/biovino.json";
import vinsData from "./vins.json";

type CaveRef = {
  cave_id: number;
  cave_nom: string;
  vins_proposes: { vin_id: string; disponible: boolean }[];
};

const biovino = biovinoData as unknown as CaveRef;
const ALL_VINS: Vin[] = vinsData.vins as unknown as Vin[];

// Assemble Domaine objects with their vins for UI consumption.
// domaines.json has no vins; we join them here from vins.json.
function assembleDomaines(vins: Vin[]): Domaine[] {
  const byDomaine = new Map<string, Vin[]>();
  for (const v of vins) {
    const key = (v as unknown as { domaine_id: string }).domaine_id;
    if (!byDomaine.has(key)) byDomaine.set(key, []);
    byDomaine.get(key)!.push(v);
  }

  const result: Domaine[] = [];
  for (const [domaineId, domaineVins] of byDomaine) {
    const entry = getDomaineById(domaineId);
    if (!entry) continue;
    result.push({
      id: entry.id,
      nom: entry.nom,
      vigneron: entry.vigneron ?? undefined,
      village: entry.village ?? undefined,
      departement: entry.departement ?? undefined,
      region: entry.region ?? undefined,
      appellation_principale: entry.appellation_principale ?? undefined,
      surface_ha: entry.surface_ha ?? undefined,
      anciennete_bio: entry.anciennete_bio ?? undefined,
      philosophie: entry.philosophie ?? undefined,
      histoire: entry.histoire ?? undefined,
      site_web: entry.site_web ?? undefined,
      photo_url: entry.photo_url ?? undefined,
      curateur_nom: entry.curateur_nom ?? undefined,
      vins: domaineVins,
    });
  }
  return result;
}

export function getCavesDomaines(): Domaine[] {
  const caveVinIds = new Set(biovino.vins_proposes.map((v) => v.vin_id));
  const caveVins = ALL_VINS.filter((v) => caveVinIds.has(v.id));
  return assembleDomaines(caveVins);
}

export function getDomainesByCaveId(caveId: number): Domaine[] {
  if (caveId === biovino.cave_id) return getCavesDomaines();
  return [];
}

export function getAllDomaines(): Domaine[] {
  return assembleDomaines(ALL_VINS);
}

export function getAllVins(): Vin[] {
  return ALL_VINS;
}

export function getVinById(id: string): Vin | null {
  return ALL_VINS.find((v) => v.id === id) ?? null;
}

export function getVinsByDomaine(domaineId: string): Vin[] {
  return ALL_VINS.filter((v) => (v as unknown as { domaine_id: string }).domaine_id === domaineId);
}

export function getVinsByCave(caveId: number): Vin[] {
  if (caveId !== biovino.cave_id) return [];
  const ids = new Set(biovino.vins_proposes.map((v) => v.vin_id));
  return ALL_VINS.filter((v) => ids.has(v.id));
}
