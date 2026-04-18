import { useEffect, useState } from "react";

import { API } from "../config";
import { Adresse } from "../utils/types";

// Charge toutes les adresses pour la carte (limite haute, pas de pagination)
export function useAdresses() {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/adresses?limit=500`)
      .then((res) => res.json())
      .then((data) => {
        setAdresses(Array.isArray(data) ? data : (data.data ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { adresses, loading };
}
