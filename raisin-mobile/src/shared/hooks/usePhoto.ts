import { useEffect, useState } from "react";

import { getPhoto } from "../../features/adresses/api";

export function usePhoto(id: number | null) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setPhoto(null);
      return;
    }
    getPhoto(id)
      .then(setPhoto)
      .catch(() => {});
  }, [id]);

  return photo;
}
