import { useMemo } from "react";

import { getVinsByDomaine } from "../../vins/api/vinsApi";
import type { Vin } from "../../vins/types";

export function useVinsByDomaine(domaineId: string): { vins: Vin[] } {
  const vins = useMemo(() => getVinsByDomaine(domaineId), [domaineId]);
  return { vins };
}
