import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { usePhoto } from "../../../shared/hooks/usePhoto";
import { typeCouleur, typeEmoji, typeLabel } from "../../../shared/utils/formatters";
import { Adresse } from "../../adresses/types";

interface Props {
  selected: Adresse | null;
  onClose: () => void;
}

const PANEL_H = 320;
const EXPANDED_H = 520;
// Spring CSS : montée rapide avec micro-overshoot, descente sans rebond
// (0.22, 1, 0.36, 1) = courbe iOS standard : départ vif, décélération douce, pas d'overshoot
const SPRING_OPEN = "transform 0.44s cubic-bezier(0.22, 1, 0.36, 1)";
const SPRING_CLOSE = "transform 0.28s cubic-bezier(0.4, 0, 1, 1)";
const SPRING_SNAP = "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)";

export default function PanelWeb({ selected, onClose }: Props) {
  const [photoPleinEcran, setPhotoPleinEcran] = useState(false);
  const photo = usePhoto(selected?.id ?? null);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startTY: number; currentTY: number } | null>(null);
  const currentTY = useRef(PANEL_H);
  const isExpanded = useRef(false);

  const setTY = (ty: number, transition: string) => {
    if (!panelRef.current) return;
    panelRef.current.style.transition = transition;
    panelRef.current.style.transform = `translateY(${ty}px)`;
    currentTY.current = ty;
    // Backdrop opacity
    if (backdropRef.current) {
      const opacity = Math.max(0, Math.min(0.48, (1 - ty / PANEL_H) * 0.48));
      backdropRef.current.style.opacity = String(opacity);
      backdropRef.current.style.pointerEvents = ty < PANEL_H ? "auto" : "none";
    }
  };

  useEffect(() => {
    if (selected) {
      setTY(0, SPRING_OPEN);
      isExpanded.current = false;
    } else {
      setTY(PANEL_H, SPRING_CLOSE);
      setPhotoPleinEcran(false);
      isExpanded.current = false;
    }
  }, [selected]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    // Stop spring mid-flight
    const matrix = new DOMMatrix(window.getComputedStyle(panelRef.current).transform);
    const liveTY = matrix.m42;
    panelRef.current.style.transition = "none";
    panelRef.current.style.transform = `translateY(${liveTY}px)`;
    currentTY.current = liveTY;
    drag.current = { startY: e.clientY, startTY: liveTY, currentTY: liveTY };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current || !panelRef.current) return;
      const delta = e.clientY - drag.current.startY;
      let next = drag.current.startTY + delta;
      if (next < 0) next = next * 0.15; // rubber band vers le haut
      next = Math.min(PANEL_H * 1.1, next);
      panelRef.current.style.transform = `translateY(${next}px)`;
      drag.current.currentTY = next;
      // Backdrop live
      if (backdropRef.current) {
        const opacity = Math.max(0, Math.min(0.48, (1 - next / PANEL_H) * 0.48));
        backdropRef.current.style.opacity = String(opacity);
      }
    };

    const onUp = (e: MouseEvent) => {
      if (!drag.current) return;
      const endTY = drag.current.currentTY;
      const delta = e.clientY - drag.current.startY;
      // Vélocité approximée (pixels par ms × 16)
      const vel = delta; // grossière mais suffisante
      drag.current = null;

      if (endTY > PANEL_H * 0.35 || vel > 80) {
        setTY(PANEL_H, SPRING_CLOSE);
        onClose();
      } else if (endTY < -30 || vel < -60) {
        // Expand
        if (panelRef.current) {
          panelRef.current.style.transition = SPRING_SNAP;
          panelRef.current.style.height = `${EXPANDED_H}px`;
        }
        setTY(0, SPRING_SNAP);
        isExpanded.current = true;
      } else {
        // Reset height if was expanded
        if (isExpanded.current && endTY > 40 && panelRef.current) {
          panelRef.current.style.transition = SPRING_SNAP;
          panelRef.current.style.height = `${PANEL_H}px`;
          isExpanded.current = false;
        }
        setTY(0, SPRING_SNAP);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onClose]);

  if (!selected || Platform.OS !== "web") return null;
  const couleur = typeCouleur(selected.type);

  return (
    <>
      {photoPleinEcran && (
        <div
          onClick={() => setPhotoPleinEcran(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={photo!}
            style={{ maxWidth: "95%", maxHeight: "95%", borderRadius: 12, objectFit: "contain" }}
          />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ✕
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 999,
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: PANEL_H,
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -6px 32px rgba(0,0,0,0.12)",
          zIndex: 1000,
          transform: `translateY(${PANEL_H}px)`,
          cursor: "grab",
          userSelect: "none",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {/* Handle */}
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}
        >
          <div style={{ width: 36, height: 5, background: "#D1D1D6", borderRadius: 3 }} />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#F2F2F7",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#555",
            fontWeight: 700,
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "flex",
            padding: "4px 16px 16px",
            gap: 12,
            height: "calc(100% - 30px)",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 7,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                background: couleur + "18",
                color: couleur,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.8,
                padding: "4px 10px",
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              {typeEmoji(selected.type)} {typeLabel(selected.type).toUpperCase()}
            </span>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.2 }}>
              {selected.nom}
            </div>
            <div style={{ fontSize: 13, color: "#777" }}>
              📍 {selected.adresse ? `${selected.adresse}, ` : ""}
              {selected.ville}
            </div>
            {selected.description && (
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5, overflow: "hidden" }}>
                {selected.description}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`,
                    "_blank",
                  )
                }
                style={{
                  flex: 1,
                  background: couleur,
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  padding: "13px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗺 Itinéraire
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(selected.nom + " " + selected.ville)}`,
                    "_blank",
                  )
                }
                style={{
                  flex: 1,
                  background: "#F2F2F7",
                  color: "#333",
                  border: "none",
                  borderRadius: 14,
                  padding: "13px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔍 Web
              </button>
            </div>
          </div>

          <div
            onClick={() => photo && setPhotoPleinEcran(true)}
            style={{
              width: 140,
              flexShrink: 0,
              cursor: photo ? "pointer" : "default",
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {photo ? (
              <>
                <img
                  src={photo}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.45)",
                    borderRadius: 6,
                    padding: "3px 7px",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  ⛶
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#F2F2F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                }}
              >
                {typeEmoji(selected.type)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
