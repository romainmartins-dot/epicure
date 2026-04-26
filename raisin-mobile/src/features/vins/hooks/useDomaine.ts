import { useEffect, useState } from "react";

import { getDomaineById } from "../api/vinsApi";
import { Domaine } from "../types";

export function useDomaine(id: string) {
  const [domaine, setDomaine] = useState<Domaine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDomaineById(id)
      .then(setDomaine)
      .catch(() => setDomaine(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { domaine, loading };
}
