import { useMemo } from "react";

import { useAllVins } from "../../vins/hooks/useAllVins";
import { useFavorisContext } from "../FavorisContext";

export function useAllFavoriVins() {
  const { favoriteIds, loading } = useFavorisContext();
  const { vins } = useAllVins();

  const favoriteVins = useMemo(() => {
    return favoriteIds.map((id) => vins.find((v) => v.id === id)).filter((v) => v !== undefined);
  }, [favoriteIds, vins]);

  return { favoriteVins, loading };
}
