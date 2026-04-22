import mock from "../../../../data/mock";
import { Adresse } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;
const PAGE = 20;
const photoCache = new Map<number, string | null>();

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getAll(): Promise<Adresse[]> {
  if (!API) return mock;
  const json = await get<any>(`${API}/adresses?limit=500`);
  return Array.isArray(json) ? json : json.data;
}

export async function getList(
  ville?: string,
  limit = PAGE,
  offset = 0,
): Promise<{ data: Adresse[]; total: number }> {
  if (!API) {
    const src = ville
      ? mock.filter((a: Adresse) => a.ville.toLowerCase().includes(ville.toLowerCase()))
      : mock;
    return { data: src.slice(offset, offset + limit), total: src.length };
  }
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (ville) params.set("ville", ville);
  const json = await get<any>(`${API}/adresses?${params}`);
  return Array.isArray(json) ? { data: json, total: json.length } : json;
}

export async function getPhoto(id: number): Promise<string | null> {
  if (!API) return null;
  if (photoCache.has(id)) return photoCache.get(id)!;
  const res = await fetch(`${API}/adresses/${id}/photo`);
  const { photo = null } = await res.json();
  photoCache.set(id, photo);
  return photo;
}
