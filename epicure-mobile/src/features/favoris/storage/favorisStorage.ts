import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "epicure.favorites.vins.v1";

type StoredEntry = { id: string; addedAt: number };

async function readEntries(): Promise<StoredEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredEntry[];
  } catch {
    return [];
  }
}

async function writeEntries(entries: StoredEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
}

export async function getAllFavoriteVinIds(): Promise<string[]> {
  const entries = await readEntries();
  return entries.sort((a, b) => b.addedAt - a.addedAt).map((e) => e.id);
}

export async function isVinFavorite(vinId: string): Promise<boolean> {
  const entries = await readEntries();
  return entries.some((e) => e.id === vinId);
}

export async function addFavoriteVin(vinId: string): Promise<void> {
  const entries = await readEntries();
  if (entries.some((e) => e.id === vinId)) return;
  await writeEntries([...entries, { id: vinId, addedAt: Date.now() }]);
}

export async function removeFavoriteVin(vinId: string): Promise<void> {
  const entries = await readEntries();
  await writeEntries(entries.filter((e) => e.id !== vinId));
}

export async function toggleFavoriteVin(vinId: string): Promise<boolean> {
  const entries = await readEntries();
  const exists = entries.some((e) => e.id === vinId);
  if (exists) {
    await writeEntries(entries.filter((e) => e.id !== vinId));
    return false;
  } else {
    await writeEntries([...entries, { id: vinId, addedAt: Date.now() }]);
    return true;
  }
}
