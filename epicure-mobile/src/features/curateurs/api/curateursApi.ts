import data from "../data/curateurs.json";
import { Curateur } from "../types";

const curateurs: Curateur[] = data.curateurs;

export function getCurateurById(id: string): Curateur | null {
  return curateurs.find((c) => c.id === id) ?? null;
}

export function getCurateurByCaveId(caveId: number): Curateur | null {
  return curateurs.find((c) => c.cave_id === caveId) ?? null;
}
