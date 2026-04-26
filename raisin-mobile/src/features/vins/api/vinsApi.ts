import pocData from "../data/vins-poc.json";
import { Domaine, Vin } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;
const allDomaines = pocData.domaines as Domaine[];
const caveDomains = pocData.cave_domains as Record<string, string[]>;

function mockDomainesByCaveId(caveId: number): Domaine[] {
  const ids = caveDomains[String(caveId)] ?? [];
  return allDomaines.filter((d) => ids.includes(d.id));
}

export async function getVinsByCaveId(caveId: number): Promise<Domaine[]> {
  if (!API) return mockDomainesByCaveId(caveId);
  const res = await fetch(`${API}/caves/${caveId}/vins`);
  if (!res.ok) return mockDomainesByCaveId(caveId);
  return res.json();
}

export async function getVinById(id: string): Promise<Vin | null> {
  const vin = allDomaines.flatMap((d) => d.vins).find((v) => v.id === id);
  if (!API) return vin ?? null;
  const res = await fetch(`${API}/vins/${id}`);
  if (!res.ok) return vin ?? null;
  return res.json();
}

export async function getDomaineById(id: string): Promise<Domaine | null> {
  const domaine = allDomaines.find((d) => d.id === id);
  if (!API) return domaine ?? null;
  const res = await fetch(`${API}/domaines/${id}`);
  if (!res.ok) return domaine ?? null;
  return res.json();
}
