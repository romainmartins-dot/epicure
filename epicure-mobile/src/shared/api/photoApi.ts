const API = process.env.EXPO_PUBLIC_API_URL;
const cache = new Map<number, string | null>();

const MOCK_PHOTOS: Record<number, string> = {
  2061: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80",
  2064: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
  2068: "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?w=800&q=80",
  2062: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800&q=80",
  2067: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
};

export async function fetchPhoto(id: number): Promise<string | null> {
  if (!API) return MOCK_PHOTOS[id] ?? null;
  if (cache.has(id)) return cache.get(id)!;
  try {
    const res = await fetch(`${API}/adresses/${id}/photo`);
    if (!res.ok) return MOCK_PHOTOS[id] ?? null;
    const { photo = null } = await res.json();
    cache.set(id, photo);
    return photo;
  } catch {
    return MOCK_PHOTOS[id] ?? null;
  }
}
