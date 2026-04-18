import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";

import MapView, { Marker } from "react-native-maps";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { typeCouleur, typeEmoji } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

const SPRING_IN = Easing.bezier(0.34, 1.4, 0.64, 1);
const SPRING_OUT = Easing.bezier(0.25, 1, 0.5, 1);

function MarkerPin({ item, isSelected }: { item: Adresse; isSelected: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isSelected ? 1.45 : 1, {
      duration: isSelected ? 350 : 250,
      easing: isSelected ? SPRING_IN : SPRING_OUT,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.pin, { backgroundColor: typeCouleur(item.type) }, animStyle]}>
      <Text style={styles.emoji}>{typeEmoji(item.type)}</Text>
    </Animated.View>
  );
}

export default function MapNative({ adresses, selected, onMarkerClick }: Props) {
  // IDs qui nécessitent tracksViewChanges=true le temps de l'animation
  // Actif brièvement sur sélection/désélection, puis désactivé — évite le clignotement react-native-maps
  const [trackingIds, setTrackingIds] = useState<Set<number>>(new Set());
  const prevSelectedId = useRef<number | null>(null);

  useEffect(() => {
    const ids = new Set<number>();
    if (selected?.id != null) ids.add(selected.id);
    if (prevSelectedId.current != null) ids.add(prevSelectedId.current);
    prevSelectedId.current = selected?.id ?? null;

    setTrackingIds(ids);
    const t = setTimeout(() => setTrackingIds(new Set()), 400);
    return () => clearTimeout(t);
  }, [selected]);

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
      initialRegion={{
        latitude: 46.5,
        longitude: 2.5,
        latitudeDelta: 8,
        longitudeDelta: 8,
      }}
    >
      {adresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={coords.get(item.id)!}
          onPress={() => onMarkerClick(item)}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={trackingIds.has(item.id)}
        >
          <MarkerPin item={item} isSelected={selected?.id === item.id} />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emoji: { fontSize: 14 },
});
