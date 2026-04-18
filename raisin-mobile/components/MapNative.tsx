import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

import { typeCouleur } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
  onMapInteraction?: () => void;
}

// ─── Composants visuels ──────────────────────────────────────────────────────

const LabelPin = memo(function LabelPin({ item }: { item: Adresse }) {
  return (
    <View style={styles.label}>
      <View style={[styles.labelDot, { backgroundColor: typeCouleur(item.type) }]} />
      <Text style={styles.labelText} numberOfLines={1}>
        {item.nom}
      </Text>
    </View>
  );
});

const ClusterBubble = memo(function ClusterBubble({
  count,
  small,
}: {
  count: number;
  small?: boolean;
}) {
  return (
    <View style={[styles.cluster, small && styles.clusterSmall]}>
      <Text style={styles.clusterEmoji}>🍷</Text>
      <Text style={[styles.clusterCount, small && styles.clusterCountSmall]}>{count}</Text>
    </View>
  );
});

// ─── Constantes ──────────────────────────────────────────────────────────────

const PANEL_H = 320;
const CITY_THRESHOLD = 0.8;
const LABEL_THRESHOLD = 0.06;
const MATCH_RADIUS = 0.002;

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// ─── Helpers clustering ───────────────────────────────────────────────────────

function clusterByKey(adresses: Adresse[], cellSize: number) {
  const cells = new Map<string, { latSum: number; lngSum: number; count: number }>();
  for (const a of adresses) {
    const lat = parseFloat(a.latitude);
    const lng = parseFloat(a.longitude);
    const key = `${Math.floor(lat / cellSize)}_${Math.floor(lng / cellSize)}`;
    const c = cells.get(key);
    if (c) {
      c.latSum += lat;
      c.lngSum += lng;
      c.count += 1;
    } else cells.set(key, { latSum: lat, lngSum: lng, count: 1 });
  }
  return Array.from(cells.entries()).map(([key, c]) => ({
    key,
    latitude: c.latSum / c.count,
    longitude: c.lngSum / c.count,
    count: c.count,
  }));
}

function findNearest(adresses: Adresse[], lat: number, lng: number): Adresse | null {
  let best: Adresse | null = null;
  let bestDist = MATCH_RADIUS;
  for (const a of adresses) {
    const d = Math.sqrt((parseFloat(a.latitude) - lat) ** 2 + (parseFloat(a.longitude) - lng) ** 2);
    if (d < bestDist) {
      bestDist = d;
      best = a;
    }
  }
  return best;
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MapNative({ adresses, selected, onMarkerClick, onMapInteraction }: Props) {
  const mapViewRef = useRef<MapView>(null);
  const deltaRef = useRef(8);
  const lastMarkerPress = useRef(0);
  const userLocRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const centeredRef = useRef(false);
  const [region, setRegion] = useState<Region>({
    latitude: 46.5,
    longitude: 2.5,
    latitudeDelta: 8,
    longitudeDelta: 8,
  });

  const validAdresses = useMemo(
    () =>
      adresses.filter((a) => isFinite(parseFloat(a.latitude)) && isFinite(parseFloat(a.longitude))),
    [adresses],
  );

  const coords = useMemo(
    () =>
      new Map(
        validAdresses.map((a) => [
          a.id,
          { latitude: parseFloat(a.latitude), longitude: parseFloat(a.longitude) },
        ]),
      ),
    [validAdresses],
  );

  const cityClusters = useMemo(() => clusterByKey(validAdresses, 0.5), [validAdresses]);

  const neighborClusters = useMemo(() => {
    const { latitudeDelta } = region;
    if (latitudeDelta >= CITY_THRESHOLD || latitudeDelta < LABEL_THRESHOLD) return [];
    return clusterByKey(validAdresses, latitudeDelta / 4);
  }, [validAdresses, region]);

  const visibleLabels = useMemo(() => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    if (latitudeDelta >= LABEL_THRESHOLD) return [];
    const pad = 0.5;
    return validAdresses.filter((a) => {
      const lat = parseFloat(a.latitude);
      const lng = parseFloat(a.longitude);
      return (
        Math.abs(lat - latitude) < latitudeDelta * (0.5 + pad) &&
        Math.abs(lng - longitude) < longitudeDelta * (0.5 + pad)
      );
    });
  }, [validAdresses, region]);

  const handleRegionChange = useCallback((r: Region) => {
    deltaRef.current = r.latitudeDelta;
  }, []);
  const handleRegionChangeComplete = useCallback((r: Region) => {
    deltaRef.current = r.latitudeDelta;
    setRegion(r);
  }, []);

  const handleMarkerPress = useCallback(
    (item: Adresse) => {
      lastMarkerPress.current = Date.now();
      onMarkerClick(item);
    },
    [onMarkerClick],
  );

  const handlePoiClick = useCallback(
    (e: any) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      const match = findNearest(validAdresses, latitude, longitude);
      if (match) {
        lastMarkerPress.current = Date.now();
        onMarkerClick(match);
      }
    },
    [validAdresses, onMarkerClick],
  );

  const handleMapPress = useCallback(() => {
    if (Date.now() - lastMarkerPress.current > 200) onMapInteraction?.();
  }, [onMapInteraction]);

  const handleUserLocation = useCallback((e: any) => {
    const coord = e.nativeEvent?.coordinate;
    if (!coord || !isFinite(coord.latitude) || !isFinite(coord.longitude)) return;
    userLocRef.current = { latitude: coord.latitude, longitude: coord.longitude };
    if (!centeredRef.current) {
      centeredRef.current = true;
      mapViewRef.current?.animateToRegion(
        {
          latitude: coord.latitude,
          longitude: coord.longitude,
          latitudeDelta: 0.12,
          longitudeDelta: 0.12,
        },
        800,
      );
    }
  }, []);

  const locateUser = useCallback(() => {
    const loc = userLocRef.current;
    if (loc)
      mapViewRef.current?.animateToRegion(
        { ...loc, latitudeDelta: 0.12, longitudeDelta: 0.12 },
        500,
      );
  }, []);

  useEffect(() => {
    if (!selected) return;
    const lat = parseFloat(selected.latitude);
    const lng = parseFloat(selected.longitude);
    if (!isFinite(lat) || !isFinite(lng)) return;
    mapViewRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      500,
    );
  }, [selected]);

  const delta = region.latitudeDelta;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        initialRegion={{ latitude: 46.5, longitude: 2.5, latitudeDelta: 8, longitudeDelta: 8 }}
        mapPadding={{ top: 0, right: 0, bottom: PANEL_H, left: 0 }}
        showsUserLocation
        onUserLocationChange={handleUserLocation}
        onPress={handleMapPress}
        onPoiClick={handlePoiClick}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {delta >= CITY_THRESHOLD &&
          cityClusters.map((c) => (
            <Marker
              key={c.key}
              coordinate={{ latitude: c.latitude, longitude: c.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              onPress={() =>
                mapViewRef.current?.animateToRegion(
                  {
                    latitude: c.latitude,
                    longitude: c.longitude,
                    latitudeDelta: 0.12,
                    longitudeDelta: 0.12,
                  },
                  500,
                )
              }
            >
              <ClusterBubble count={c.count} />
            </Marker>
          ))}

        {delta < CITY_THRESHOLD &&
          delta >= LABEL_THRESHOLD &&
          neighborClusters.map((c) => (
            <Marker
              key={c.key}
              coordinate={{ latitude: c.latitude, longitude: c.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              onPress={() =>
                mapViewRef.current?.animateToRegion(
                  {
                    latitude: c.latitude,
                    longitude: c.longitude,
                    latitudeDelta: Math.max(0.002, delta * 0.35),
                    longitudeDelta: Math.max(0.002, delta * 0.35),
                  },
                  450,
                )
              }
            >
              <ClusterBubble count={c.count} small />
            </Marker>
          ))}

        {delta < LABEL_THRESHOLD &&
          visibleLabels.map((item) => {
            const coord = coords.get(item.id);
            if (!coord) return null;
            return (
              <Marker
                key={item.id}
                coordinate={coord}
                anchor={{ x: 0.5, y: 1.4 }}
                tracksViewChanges={false}
                onPress={() => handleMarkerPress(item)}
              >
                <LabelPin item={item} />
              </Marker>
            );
          })}
      </MapView>

      <TouchableOpacity style={styles.locateBtn} onPress={locateUser}>
        <Text style={styles.locateTxt}>◎</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  label: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: 140,
  },
  labelDot: { width: 7, height: 7, borderRadius: 3.5, flexShrink: 0 },
  labelText: { fontSize: 11, fontWeight: "600", color: "#1a1a1a" },
  cluster: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  clusterSmall: { paddingHorizontal: 8, paddingVertical: 5 },
  clusterEmoji: { fontSize: 14 },
  clusterCount: { fontSize: 13, fontWeight: "700", color: "#1a1a1a" },
  clusterCountSmall: { fontSize: 12 },
  locateBtn: {
    position: "absolute",
    bottom: PANEL_H + 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  locateTxt: { fontSize: 22, color: "#007AFF" },
});
