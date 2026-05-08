import { useMemo } from "react";

import { getDomainesByRegion } from "../api/domainesApi";
import { Domaine } from "../types";

export function useDomainesByRegion(region: string): { domaines: Domaine[] } {
  const domaines = useMemo(() => getDomainesByRegion(region), [region]);
  return { domaines };
}
