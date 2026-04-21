import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type Adresse } from "../src/features/adresses";
import { Map, Panel, useAdresses } from "../src/features/map";
import ListeView from "./liste";

export default function Index() {
  const { adresses, loading } = useAdresses();
  const [vue, setVue] = useState<"carte" | "liste">("carte");
  const [selected, setSelected] = useState<Adresse | null>(null);
  const insets = useSafeAreaInsets();
  const handleClose = useCallback(() => setSelected(null), []);

  if (loading)
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderTitle}>Raisin</Text>
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 20 }} />
      </View>
    );

  if (vue === "liste") {
    return <ListeView onBack={() => setVue("carte")} />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Map adresses={adresses} selected={selected} onMarkerClick={setSelected} />
      <Panel selected={selected} onClose={handleClose} />
      <TouchableOpacity
        style={[styles.floatingBtn, { left: 16, bottom: insets.bottom + 16 }]}
        onPress={() => setVue("liste")}
      >
        <Text style={styles.floatingBtnText}>Liste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a0a00" },
  loaderTitle: { fontSize: 32, fontWeight: "bold", color: "#fff", letterSpacing: 2 },
  floatingBtn: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingBtnText: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
});
