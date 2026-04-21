import { useEffect, useState } from "react";

import { getAll } from "../services/adresses";
import { Adresse } from "../utils/types";

export function useAdresses() {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAll()
      .then(setAdresses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { adresses, loading };
}
