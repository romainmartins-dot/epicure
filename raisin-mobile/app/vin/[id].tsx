import { Pressable, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { VinDetailScreen, useVinDetail } from "../../src/features/vins";

export default function VinPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vin, domaine, loading } = useVinDetail(id ?? "");

  return (
    <View style={styles.container}>
      <VinDetailScreen vin={vin} domaine={domaine} loading={loading} />
      <Pressable
        style={styles.backBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: {
    position: "absolute",
    top: 56,
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
  },
});
