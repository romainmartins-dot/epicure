import { Pressable, StyleSheet, View, useColorScheme } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { CurateurProfileScreen } from "../../src/features/curateurs/components/CurateurProfileScreen";

export default function CurateurPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1C1C1E" : "#fff" }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <CurateurProfileScreen curateurId={id} />

      <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={goBack}>
        <Ionicons name="chevron-back" size={22} color={isDark ? "#FFFFFF" : "#1A1A1A"} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    zIndex: 20,
  },
});
