import { useEffect, useRef } from "react";
import { View } from "react-native";

import { typeCouleur, typeEmoji } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  onMarkerClick: (item: Adresse) => void;
  onMapReady?: (map: any) => void;
}

export default function MapWeb({ adresses, onMarkerClick, onMapReady }: Props) {
  const initialized = useRef(false);
  const onMarkerClickRef = useRef(onMarkerClick);
  const onMapReadyRef = useRef(onMapReady);
  onMarkerClickRef.current = onMarkerClick;
  onMapReadyRef.current = onMapReady;

  useEffect(() => {
    if (initialized.current || adresses.length === 0) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      const el = document.getElementById("map");
      if (!el || (el as any)._leaflet_id) return;
      const L = (window as any).L;
      if (!L) return;

      const map = L.map("map").setView([46.5, 2.5], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = (type: string) =>
        L.divIcon({
          className: "",
          html: `<div style="background:${typeCouleur(type)};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">${typeEmoji(type)}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

      adresses.forEach((item) => {
        const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)], {
          icon: icon(item.type),
        }).addTo(map);
        marker.on("click", () => onMarkerClickRef.current(item));
      });

      initialized.current = true;
      if (onMapReadyRef.current) onMapReadyRef.current(map);
    };

    if ((window as any).L) initMap();
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [adresses]);

  return (
    <View style={{ flex: 1 }}>
      <div id="map" style={{ width: "100%", height: "100%", minHeight: 400 }} />
    </View>
  );
}
