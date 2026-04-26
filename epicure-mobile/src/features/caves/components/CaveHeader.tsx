import { Dimensions, StyleSheet, View } from "react-native";

import { Image } from "expo-image";

import { Ionicons } from "@expo/vector-icons";

import { usePhoto } from "../../../shared/hooks/usePhoto";

const { width } = Dimensions.get("window");
const PHOTO_HEIGHT = Math.round(width * (9 / 16));
// Bands from transparent → white, simulates a bottom-edge fade (no lib required)
const FADE_BANDS = [0, 0.08, 0.2, 0.4, 0.65, 0.85, 1] as const;

interface Props {
  id: number;
}

export function CaveHeader({ id }: Props) {
  const photo = usePhoto(id);

  if (!photo) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="wine-outline" size={64} color="#C7C7CC" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Image source={photo} style={styles.photo} contentFit="cover" cachePolicy="disk" />
      <View style={styles.fadeOverlay} pointerEvents="none">
        {FADE_BANDS.map((opacity, i) => (
          <View
            key={i}
            style={[styles.fadeBand, { backgroundColor: `rgba(255,255,255,${opacity})` }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width, height: PHOTO_HEIGHT },
  photo: { width, height: PHOTO_HEIGHT },
  placeholder: {
    width,
    height: PHOTO_HEIGHT,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  fadeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    flexDirection: "column",
  },
  fadeBand: { flex: 1 },
});
