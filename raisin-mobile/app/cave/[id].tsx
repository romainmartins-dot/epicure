import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { CaveDetailScreen, useCave } from "../../src/features/caves";

export default function CavePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cave, loading } = useCave(Number(id));

  return (
    <View style={styles.container}>
      <CaveDetailScreen cave={cave} loading={loading} />
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
