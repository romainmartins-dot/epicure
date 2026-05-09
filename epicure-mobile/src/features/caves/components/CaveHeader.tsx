import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";

import { Image } from "expo-image";

import { Ionicons } from "@expo/vector-icons";

import { usePhoto } from "../../../shared/hooks/usePhoto";

const { width } = Dimensions.get("window");
export const PHOTO_HEIGHT = Math.max(Math.round(width * (9 / 16)), 320);

const FADE_BANDS = [0, 0.03, 0.08, 0.16, 0.28, 0.44, 0.62, 0.8, 0.94, 1] as const;

interface Props {
  id: number;
}

export function CaveHeader({ id }: Props) {
  const photo = usePhoto(id);
  const isDark = useColorScheme() === "dark";
  const fadeBg = isDark ? "28,28,30" : "255,255,255";
  const placeholderBg = isDark ? "#2C2C2E" : "#E5E5EA";

  if (!photo) {
    return (
      <View style={[styles.placeholder, { backgroundColor: placeholderBg }]}>
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
            style={[styles.fadeBand, { backgroundColor: `rgba(${fadeBg},${opacity})` }]}
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
    justifyContent: "center",
    alignItems: "center",
  },
  fadeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "column",
  },
  fadeBand: { flex: 1 },
});
