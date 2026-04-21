import { useEffect, useRef } from "react";
import { View } from "react-native";

import { typeCouleur, typeEmoji } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

// Spring CSS — légère surcompensation pour feel vivant sans vrai rebond
const SPRING = "transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)";
const SNAP_BACK = "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)";

function markerHtml(type: string) {
  const color = typeCouleur(type);
  return `<div style="
    width:32px;height:32px;border-radius:50%;
    background:${color};border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:14px;will-change:transform;
  ">${typeEmoji(type)}</div>`;
}

export default function MapWeb({ adresses, selected, onMarkerClick }: Props) {
  const initialized = useRef(false);
  const markersRef = useRef<Map<number, any>>(new Map());
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

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

      adresses.forEach((item) => {
        const icon = L.divIcon({
          className: "",
          html: markerHtml(item.type),
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)], {
          icon,
        }).addTo(map);
        marker.on("click", () => onMarkerClickRef.current(item));
        markersRef.current.set(item.id, marker);
      });

      initialized.current = true;
    };

    if ((window as any).L) initMap();
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [adresses]);

  // Animer le marqueur sélectionné via CSS transform — jamais setIcon (recrée le DOM)
  const prevSelectedId = useRef<number | null>(null);
  useEffect(() => {
    const setScale = (id: number | null, scale: number, transition: string) => {
      if (id === null) return;
      const marker = markersRef.current.get(id);
      if (!marker) return;
      const div = marker.getElement()?.querySelector("div");
      if (!div) return;
      div.style.transition = transition;
      div.style.transform = `scale(${scale})`;
    };

    setScale(prevSelectedId.current, 1, SNAP_BACK);
    setScale(selected?.id ?? null, 1.45, SPRING);
    prevSelectedId.current = selected?.id ?? null;
  }, [selected]);

  return (
    <View style={{ flex: 1 }}>
      <div id="map" style={{ width: "100%", height: "100%", minHeight: 400 }} />
    </View>
  );
}
