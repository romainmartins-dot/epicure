import { useEffect, useState } from "react";

import { getCurateurById } from "../api/curateursApi";
import { Curateur } from "../types";

export function useCurateur(curateurId: string) {
  const [curateur, setCurateur] = useState<Curateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const result = getCurateurById(curateurId);
    setCurateur(result);
    setLoading(false);
  }, [curateurId]);

  return { curateur, loading };
}
