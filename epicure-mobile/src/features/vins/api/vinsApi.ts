import { getDomaineById as getDomaineEntryById } from "../../domaines/api/domainesApi";
import {
  getAllDomaines,
  getAllVins,
  getVinById as localGetVinById,
  getVinsByCave as localGetVinsByCave,
  getVinsByDomaine as localGetVinsByDomaine,
  getDomainesByCaveId as mockDomainesByCaveId,
} from "../data";
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
  const vin = localGetVinById(id);
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
  const vin = localGetVinById(vinId) as (Vin & { domaine_id?: string }) | null;
  const domaineId = vin?.domaine_id;
  const domaine = domaineId ? getAllDomaines().find((d) => d.id === domaineId) : null;
  if (!API) return domaine ?? null;
  try {
    const res = await fetch(`${API}/vins/${vinId}/domaine`);
    if (!res.ok) return domaine ?? null;
    return res.json();
  } catch {
    return domaine ?? null;
  }
}

// New flat API
export function getAllVinsFlat(): Vin[] {
  return getAllVins();
}

export function getVinsByDomaine(domaineId: string): Vin[] {
  return localGetVinsByDomaine(domaineId);
}

export function getVinsByCave(caveId: number): Vin[] {
  return localGetVinsByCave(caveId);
}

export function getDomaineEntry(id: string) {
  return getDomaineEntryById(id);
}
