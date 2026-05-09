import { useEffect, useState } from "react";

import mock from "../../../../data/mock";
import { getAll } from "../../adresses/api";
import { Adresse } from "../../adresses/types";

const API = process.env.EXPO_PUBLIC_API_URL;

export function useAdresses() {
  const [adresses, setAdresses] = useState<Adresse[]>(API ? [] : mock);
  const [loading, setLoading] = useState(!!API);

  useEffect(() => {
    if (!API) return;
    getAll()
      .then(setAdresses)
      .catch(() => setAdresses(mock))
      .finally(() => setLoading(false));
  }, []);

  return { adresses, loading };
}
