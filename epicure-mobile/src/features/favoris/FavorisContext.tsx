import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { addFavoriteVin, getAllFavoriteVinIds, removeFavoriteVin } from "./storage/favorisStorage";

interface FavorisContextValue {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (vinId: string) => boolean;
  toggle: (vinId: string) => Promise<boolean>;
}

const FavorisContext = createContext<FavorisContextValue | null>(null);

export function FavorisProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFavoriteVinIds()
      .then(setFavoriteIds)
      .finally(() => setLoading(false));
  }, []);

  const isFavorite = useCallback((vinId: string) => favoriteIds.includes(vinId), [favoriteIds]);

  const toggle = useCallback(
    async (vinId: string): Promise<boolean> => {
      const isCurrentlyFav = favoriteIds.includes(vinId);
      // Optimistic update
      if (isCurrentlyFav) {
        setFavoriteIds((prev) => prev.filter((id) => id !== vinId));
        await removeFavoriteVin(vinId);
        return false;
      } else {
        setFavoriteIds((prev) => [vinId, ...prev]);
        await addFavoriteVin(vinId);
        return true;
      }
    },
    [favoriteIds],
  );

  return (
    <FavorisContext.Provider value={{ favoriteIds, loading, isFavorite, toggle }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavorisContext(): FavorisContextValue {
  const ctx = useContext(FavorisContext);
  if (!ctx) throw new Error("useFavorisContext must be used inside FavorisProvider");
  return ctx;
}
