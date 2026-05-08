import { useMemo } from "react";

import { getAllDomaines } from "../data";
import { Vin } from "../types";

export interface VinFlat extends Vin {
  domaine_nom: string;
}

function normaliserPourTri(cuvee: string): string {
  // Supprimer articles en début : Le, La, Les, L', l'
  let s = cuvee.trim();
  s = s.replace(/^(Le|La|Les)\s+/i, "");
  s = s.replace(/^L[''’]/i, "");
  // Normaliser accents (NFD puis supprimer diacritiques)
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

function lettreSectionPour(cuvee: string): string {
  const normalized = normaliserPourTri(cuvee);
  const c = normalized[0];
  if (!c) return "#";
  if (c >= "A" && c <= "Z") return c;
  return "#";
}

export interface VinSection {
  lettre: string;
  data: VinFlat[];
}

export function useAllVins() {
  const sections = useMemo<VinSection[]>(() => {
    const domaines = getAllDomaines();
    const vins: VinFlat[] = domaines.flatMap((d) =>
      d.vins.map((v) => ({ ...v, domaine_nom: d.nom })),
    );

    const sorted = [...vins].sort((a, b) =>
      normaliserPourTri(a.cuvee).localeCompare(normaliserPourTri(b.cuvee), "fr"),
    );

    const map = new Map<string, VinFlat[]>();
    for (const vin of sorted) {
      const lettre = lettreSectionPour(vin.cuvee);
      if (!map.has(lettre)) map.set(lettre, []);
      map.get(lettre)!.push(vin);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([lettre, data]) => ({ lettre, data }));
  }, []);

  const total = useMemo(() => sections.reduce((acc, s) => acc + s.data.length, 0), [sections]);

  return { sections, total };
}
