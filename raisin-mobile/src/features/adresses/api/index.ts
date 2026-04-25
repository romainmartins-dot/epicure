import mock from "../../../../data/mock";
import { Adresse } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;
const PAGE = 20;

function mockList(ville?: string, limit = PAGE, offset = 0) {
  const src = ville
    ? mock.filter((a: Adresse) => a.ville.toLowerCase().includes(ville.toLowerCase()))
    : mock;
  return { data: src.slice(offset, offset + limit), total: src.length };
}

export async function getAll(): Promise<Adresse[]> {
  if (!API) return mock;
  const res = await fetch(`${API}/adresses?limit=500`);
  if (!res.ok) return mock;
  const json = await res.json();
  return Array.isArray(json) ? json : json.data;
}

export async function getList(
  ville?: string,
  limit = PAGE,
  offset = 0,
): Promise<{ data: Adresse[]; total: number }> {
  if (!API) return mockList(ville, limit, offset);
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (ville) params.set("ville", ville);
  const res = await fetch(`${API}/adresses?${params}`);
  if (!res.ok) return mockList(ville, limit, offset);
  const json = await res.json();
  return Array.isArray(json) ? { data: json, total: json.length } : json;
}
