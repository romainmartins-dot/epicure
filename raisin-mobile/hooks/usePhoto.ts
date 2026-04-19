import { useEffect, useState } from "react";

import { API } from "../config";

const cache = new Map<number, string | null>();

export function usePhoto(id: number | null) {
  const [photo, setPhoto] = useState<string | null>(id !== null ? (cache.get(id) ?? null) : null);

  useEffect(() => {
    if (id === null) {
      setPhoto(null);
      return;
    }
    if (cache.has(id)) {
      setPhoto(cache.get(id) ?? null);
      return;
    }
    setPhoto(null);
    fetch(`${API}/adresses/${id}/photo`)
      .then((res) => res.json())
      .then((data) => {
        cache.set(id, data.photo ?? null);
        setPhoto(data.photo ?? null);
      });
  }, [id]);

  return photo;
}
