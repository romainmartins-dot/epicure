import { useEffect, useState } from "react";

import { API } from "../config";

export function usePhoto(id: number | null) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setPhoto(null);
      return;
    }
    setPhoto(null);
    fetch(`${API}/adresses/${id}/photo`)
      .then((res) => res.json())
      .then((data) => setPhoto(data.photo));
  }, [id]);

  return photo;
}
