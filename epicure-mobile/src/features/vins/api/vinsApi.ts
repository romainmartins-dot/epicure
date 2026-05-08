import { getAllDomaines, getDomainesByCaveId as mockDomainesByCaveId } from "../data";
import { Domaine, Vin } from "../types";

const API = process.env.EXPO_PUBLIC_API_URL;

export async function getVinsByCaveId(caveId: number): Promise<Domaine[]> {
  if (!API) return mockDomainesByCaveId(caveId);
  try {
    const res = await fetch(`${API}/caves/${caveId}/vins`);
    if (!res.ok) return mockDomainesByCaveId(caveId);
    return res.json();
  } catch {
    return mockDomainesByCaveId(caveId);
  }
}

export async function getVinById(id: string): Promise<Vin | null> {
  const vin = getAllDomaines()
    .flatMap((d) => d.vins)
    .find((v) => v.id === id);
  if (!API) return vin ?? null;
  try {
    const res = await fetch(`${API}/vins/${id}`);
    if (!res.ok) return vin ?? null;
    return res.json();
  } catch {
    return vin ?? null;
  }
}

export async function getDomaineById(id: string): Promise<Domaine | null> {
  const domaine = getAllDomaines().find((d) => d.id === id);
  if (!API) return domaine ?? null;
  try {
    const res = await fetch(`${API}/domaines/${id}`);
    if (!res.ok) return domaine ?? null;
    return res.json();
  } catch {
    return domaine ?? null;
  }
}

export async function getDomaineByVinId(vinId: string): Promise<Domaine | null> {
  const domaine = getAllDomaines().find((d) => d.vins.some((v) => v.id === vinId));
  if (!API) return domaine ?? null;
  try {
    const res = await fetch(`${API}/vins/${vinId}/domaine`);
    if (!res.ok) return domaine ?? null;
    return res.json();
  } catch {
    return domaine ?? null;
  }
}
