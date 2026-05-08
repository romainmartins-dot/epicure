import { useMemo } from "react";

import { getDomaineById } from "../api/domainesApi";
import { Domaine } from "../types";

export function useDomaine(id: string): { domaine: Domaine | null } {
  const domaine = useMemo(() => getDomaineById(id), [id]);
  return { domaine };
}
