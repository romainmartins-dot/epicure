import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useVin } from "../../src/features/vins/hooks/useVin";

export default function VinPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vin, loading } = useVin(id ?? "");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Détail vin à venir</Text>
        {!loading && vin ? <Text style={styles.cuvee}>{vin.cuvee}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  content: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  placeholder: { fontSize: 17, color: "#AEAEB2" },
  cuvee: { fontSize: 26, fontWeight: "700", color: "#1A1A1A" },
});
