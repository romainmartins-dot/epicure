const API = process.env.EXPO_PUBLIC_API_URL;
const cache = new Map<number, string | null>();

export async function getPhoto(id: number): Promise<string | null> {
  if (!API) return null;
  if (cache.has(id)) return cache.get(id)!;
  const res = await fetch(`${API}/adresses/${id}/photo`);
  const { photo = null } = await res.json();
  cache.set(id, photo);
  return photo;
}
