import { useCallback, useEffect, useState } from "react";

import { getList } from "../api";
import { Adresse } from "../types";

const PAGE = 20;

export function useAdressesList(ville?: string) {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdresses([]);
    setOffset(0);
    getList(ville, PAGE, 0)
      .then(({ data, total }) => {
        setAdresses(data);
        setTotal(total);
        setOffset(data.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ville]);

  const loadMore = useCallback(() => {
    if (loadingMore || adresses.length >= total) return;
    setLoadingMore(true);
    getList(ville, PAGE, offset)
      .then(({ data }) => {
        setAdresses((prev) => [...prev, ...data]);
        setOffset((prev) => prev + data.length);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, adresses.length, total, ville, offset]);

  return { adresses, loading, loadingMore, loadMore, hasMore: adresses.length < total, total };
}
