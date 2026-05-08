import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VinsTab() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const bgColor = isDark ? "#1C1C1E" : "#F2F2F7";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const subtitleColor = "#8E8E93";

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]}>Vins</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>Glossaire — à venir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.37,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
  },
});
