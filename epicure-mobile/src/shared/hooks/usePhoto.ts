import { useEffect, useState } from "react";

import { fetchPhoto } from "../api/photoApi";

export function usePhoto(id: number | null) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setPhoto(null);
      return;
    }
    fetchPhoto(id)
      .then(setPhoto)
      .catch(() => {});
  }, [id]);

  return photo;
}
