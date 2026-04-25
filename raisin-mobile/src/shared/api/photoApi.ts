const API = process.env.EXPO_PUBLIC_API_URL;
const cache = new Map<number, string | null>();

export async function fetchPhoto(id: number): Promise<string | null> {
  if (!API) return null;
  if (cache.has(id)) return cache.get(id)!;
  const res = await fetch(`${API}/adresses/${id}/photo`);
  if (!res.ok) return null;
  const { photo = null } = await res.json();
  cache.set(id, photo);
  return photo;
}
