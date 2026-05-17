import { useMemo } from "react";

import { getCavesForDomaine } from "../../vins/data";

export interface AdresseRef {
  id: number;
  nom: string;
  type: "cave" | "restaurant";
  ville: string;
}

export function useAdressesByDomaine(domaineId: string): AdresseRef[] {
  return useMemo(() => getCavesForDomaine(domaineId), [domaineId]);
}
