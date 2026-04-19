import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import MapView, { Marker, Region } from "react-native-maps";

import { typeCouleur } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, selected, onMarkerClick }: Props) {
  const [zoom, setZoom] = useState(5);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRegionChange = useCallback((region: Region) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setZoom(Math.log2(360 / region.latitudeDelta));
    }, 150);
  }, []);

  const showLabels = zoom >= 15;

  const coords = useMemo(
    () =>
      new Map(
        adresses.map((a) => [
          a.id,
          { latitude: parseFloat(a.latitude), longitude: parseFloat(a.longitude) },
        ]),
      ),
    [adresses],
  );

  return (
    <MapView
      style={{ flex: 1 }}
      showsPointsOfInterest={false}
      initialRegion={{
        latitude: 46.5,
        longitude: 2.5,
        latitudeDelta: 8,
        longitudeDelta: 8,
      }}
      onRegionChangeComplete={handleRegionChange}
    >
      {adresses.map((item) => (
        <Marker
          key={`${item.id}-${showLabels}`}
          coordinate={coords.get(item.id)!}
          onPress={() => onMarkerClick(item)}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.pinWrap}>
            <View style={[styles.dot, { backgroundColor: typeCouleur(item.type) }]} />
            {showLabels && (
              <Text style={styles.label} numberOfLines={1}>
                {item.nom}
              </Text>
            )}
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pinWrap: {
    alignItems: "center",
    gap: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A1A",
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    maxWidth: 100,
  },
});
