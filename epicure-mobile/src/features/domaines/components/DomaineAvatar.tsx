import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { Image } from "expo-image";

import { getDomaineAvatarColor } from "../utils/getDomaineAvatarColor";
import { getDomaineInitials } from "../utils/getDomaineInitials";

interface Props {
  nom: string;
  vigneron?: string | null;
  photoUrl?: string | null;
  contextDomaines?: string[];
  size?: number;
}

export function DomaineAvatar({ nom, vigneron, photoUrl, contextDomaines, size = 36 }: Props) {
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

  const initiales = getDomaineInitials(nom, {
    vigneron: vigneron ?? undefined,
    allDomaines: contextDomaines,
  });
  const bgColor = getDomaineAvatarColor(nom, isDark);
  const fontSize = size <= 36 ? 13 : Math.round(size * 0.36);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
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
