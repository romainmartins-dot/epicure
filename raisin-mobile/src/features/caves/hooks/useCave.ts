import { useEffect, useState } from "react";

import { getCaveById } from "../api/cavesApi";
import { Cave } from "../types";

export function useCave(id: number) {
  const [cave, setCave] = useState<Cave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCaveById(id)
      .then(setCave)
      .catch(() => setCave(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { cave, loading };
}
