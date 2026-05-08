import { useMemo } from "react";

import { getAllDomaines } from "../api/domainesApi";
import { Domaine } from "../types";

export function useAllDomaines(): { domaines: Domaine[]; total: number } {
  const domaines = useMemo(() => getAllDomaines(), []);
  return { domaines, total: domaines.length };
}
