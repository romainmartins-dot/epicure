import { useFavorisContext } from "../FavorisContext";

export function useFavoriVin(vinId: string) {
  const { isFavorite, toggle, loading } = useFavorisContext();
  return {
    isFavorite: isFavorite(vinId),
    toggle: () => toggle(vinId),
    loading,
  };
}
