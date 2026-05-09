import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { Image } from "expo-image";

import { getDomaineInitials } from "../utils/getDomaineInitials";

interface Props {
  nom: string;
  photoUrl?: string | null;
  size?: number;
}

export function DomaineAvatar({ nom, photoUrl, size = 36 }: Props) {
  const isDark = useColorScheme() === "dark";

  if (photoUrl) {
    return (
      <Image
        source={photoUrl}
        style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        cachePolicy="disk"
      />
    );
  }

  const initiales = getDomaineInitials(nom);
  const fontSize = size <= 36 ? 13 : Math.round(size * 0.36);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
        },
      ]}
    >
      <Text
        style={[styles.text, { fontSize, color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
        allowFontScaling={false}
      >
        {initiales}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
