import { useCallback, useEffect, useState } from "react";

import { API } from "../config";
import { Adresse } from "../utils/types";

const LIMIT = 20;

// Charge les adresses paginées pour la vue liste, avec filtre serveur par ville
export function useAdressesList(ville?: string) {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
    setAdresses([]);
    setOffset(0);

    const params = new URLSearchParams({ limit: String(LIMIT), offset: "0" });
    if (ville) params.set("ville", ville);

    fetch(`${API}/adresses?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const items: Adresse[] = Array.isArray(data) ? data : (data.data ?? []);
        const total = Array.isArray(data) ? items.length : (data.total ?? items.length);
        setAdresses(items);
        setTotal(total);
        setOffset(items.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ville]);

  const loadMore = useCallback(() => {
    if (loadingMore || adresses.length >= total) return;
    setLoadingMore(true);

    const params = new URLSearchParams({ limit: String(LIMIT), offset: String(offset) });
    if (ville) params.set("ville", ville);

    fetch(`${API}/adresses?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const items: Adresse[] = data.data ?? [];
        setAdresses((prev) => [...prev, ...items]);
        setOffset((prev) => prev + items.length);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }, [offset, total, loadingMore, ville, adresses.length]);

  return { adresses, loading, loadingMore, loadMore, hasMore: adresses.length < total, total };
}
