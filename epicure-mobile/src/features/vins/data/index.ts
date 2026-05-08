import { Domaine } from "../types";
import biovinoData from "./caves/biovino.json";
import pocData from "./vins-poc.json";

type CaveData = {
  cave_id: number;
  cave_nom: string;
  domaines: Domaine[];
};

const caves: CaveData[] = [biovinoData as unknown as CaveData];

const pocDomaines = [
  ...(pocData.domaines as unknown as Domaine[]),
  ...((pocData as unknown as { domaines_extra?: Domaine[] }).domaines_extra ?? []),
];
const pocCaveDomains = pocData.cave_domains as Record<string, string[]>;

export function getDomainesByCaveId(caveId: number): Domaine[] {
  const cave = caves.find((c) => c.cave_id === caveId);
  if (cave) return cave.domaines;
  const ids = pocCaveDomains[String(caveId)] ?? [];
  return pocDomaines.filter((d) => ids.includes(d.id));
}

export function getAllDomaines(): Domaine[] {
  const caveIds = caves.map((c) => c.cave_id);
  const pocExtras = Object.entries(pocCaveDomains)
    .filter(([id]) => !caveIds.includes(Number(id)))
    .flatMap(([, ids]) => pocDomaines.filter((d) => ids.includes(d.id)));
  const seen = new Set<string>();
  const unique: Domaine[] = [];
  for (const d of [...caves.flatMap((c) => c.domaines), ...pocExtras]) {
    if (!seen.has(d.id)) {
      seen.add(d.id);
      unique.push(d);
    }
  }
  return unique;
}
