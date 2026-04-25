import mockVins from "../../../../data/mockVins";
import { Vin } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;

export async function getVinsByCaveId(caveId: number): Promise<Vin[]> {
  if (!API) return mockVins.filter((v) => v.cave_id === caveId);
  const res = await fetch(`${API}/caves/${caveId}/vins`);
  if (!res.ok) return mockVins.filter((v) => v.cave_id === caveId);
  return res.json();
}
