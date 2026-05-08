import { useEffect, useState } from "react";

import { getVinsByCaveId } from "../api/vinsApi";
import { Domaine } from "../types";

export function useVins(caveId: number) {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVinsByCaveId(caveId)
      .then(setDomaines)
      .catch(() => setDomaines([]))
      .finally(() => setLoading(false));
  }, [caveId]);

  return { domaines, loading };
}
