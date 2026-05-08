import { useMemo } from "react";

import { getCavesDomaines } from "../data";
import { Vin } from "../types";

export interface VinFlat extends Vin {
  domaine_nom: string;
  vigneron_nom: string | null;
}

function normaliserPourTri(cuvee: string): string {
  let s = cuvee.trim();
  s = s.replace(/^(Le|La|Les)\s+/i, "");
  s = s.replace(/^L[''']/i, "");
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

export function useAllVins() {
  const vins = useMemo<VinFlat[]>(() => {
    const domaines = getCavesDomaines();
    const flat: VinFlat[] = domaines.flatMap((d) =>
      d.vins.map((v) => ({ ...v, domaine_nom: d.nom, vigneron_nom: d.vigneron ?? null })),
    );
    return flat.sort((a, b) =>
      normaliserPourTri(a.cuvee).localeCompare(normaliserPourTri(b.cuvee), "fr"),
    );
  }, []);

  return { vins, total: vins.length };
}
