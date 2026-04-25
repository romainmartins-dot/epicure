import { useEffect, useState } from "react";

import { getVinsByCaveId } from "../api/vinsApi";
import { Vin } from "../types";

export function useVins(caveId: number) {
  const [vins, setVins] = useState<Vin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVinsByCaveId(caveId)
      .then(setVins)
      .catch(() => setVins([]))
      .finally(() => setLoading(false));
  }, [caveId]);

  return { vins, loading };
}
