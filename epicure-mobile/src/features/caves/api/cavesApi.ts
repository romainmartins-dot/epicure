import mock from "../../../../data/mock";
import { Cave } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;

export async function getCaveById(id: number): Promise<Cave | null> {
  if (!API) return mock.find((a) => a.id === id) ?? null;
  const res = await fetch(`${API}/adresses/${id}`);
  if (!res.ok) return mock.find((a) => a.id === id) ?? null;
  return res.json();
}
