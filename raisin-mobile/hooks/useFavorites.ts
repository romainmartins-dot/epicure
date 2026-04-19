import { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites";

async function load(): Promise<Set<number>> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.map(Number).filter((n) => !isNaN(n)));
  } catch {
    return new Set();
  }
}

async function save(set: Set<number>) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    load().then(setFavorites);
  }, []);

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      save(next);
      return next;
    });
  }, []);

  return { isFavorite, toggleFavorite };
}
