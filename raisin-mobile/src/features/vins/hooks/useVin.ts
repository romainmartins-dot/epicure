import { useEffect, useState } from "react";

import { getVinById } from "../api/vinsApi";
import { Vin } from "../types";

export function useVin(id: string) {
  const [vin, setVin] = useState<Vin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVinById(id)
      .then(setVin)
      .catch(() => setVin(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { vin, loading };
}
