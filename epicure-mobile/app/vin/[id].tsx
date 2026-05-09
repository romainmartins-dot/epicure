import { Pressable, StyleSheet, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { FavoriButton } from "../../src/features/favoris";
import { VinDetailScreen, useVinDetail } from "../../src/features/vins";

export default function VinPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { vin, domaine, loading } = useVinDetail(id ?? "");
  const btnTop = insets.top + 12;

  return (
    <View style={styles.container}>
      <VinDetailScreen vin={vin} domaine={domaine} loading={loading} />
      <Pressable
        style={[styles.backBtn, { top: btnTop }]}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      >
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </Pressable>
      {id && <FavoriButton vinId={id} top={btnTop} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  },
});
