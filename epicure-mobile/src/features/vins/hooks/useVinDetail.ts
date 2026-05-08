import { useEffect, useState } from "react";

import { getDomaineByVinId, getVinById } from "../api/vinsApi";
import { Domaine, Vin } from "../types";

export function useVinDetail(id: string) {
  const [vin, setVin] = useState<Vin | null>(null);
  const [domaine, setDomaine] = useState<Domaine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getVinById(id), getDomaineByVinId(id)])
      .then(([v, d]) => {
        setVin(v);
        setDomaine(d);
      })
      .catch(() => {
        setVin(null);
        setDomaine(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { vin, domaine, loading };
}
