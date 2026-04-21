import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdresseCard from "../components/AdresseCard";
import Map from "../components/Map";
import Panel from "../components/Panel";
import { useAdresses } from "../hooks/useAdresses";
import { useAdressesList } from "../hooks/useAdressesList";
import { Adresse } from "../utils/types";

export default function Index() {
  const { adresses, loading } = useAdresses();
  const [vue, setVue] = useState<"carte" | "liste">("carte");
  const [selected, setSelected] = useState<Adresse | null>(null);
  const insets = useSafeAreaInsets();

  const {
    adresses: listeAdresses,
    loading: listeLoading,
    loadingMore,
    loadMore,
    hasMore,
  } = useAdressesList();

  const handleClose = useCallback(() => setSelected(null), []);

  if (loading)
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderTitle}>Raisin</Text>
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 20 }} />
      </View>
    );

  if (vue === "carte") {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.floatingBtn, { left: 16, top: insets.top + 12 }]}
        onPress={() => setVue("carte")}
      >
        <Text style={styles.floatingBtnText}>Carte</Text>
      </TouchableOpacity>
      {listeLoading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 80 }} />
      ) : (
        <FlatList
          data={listeAdresses}
          keyExtractor={(item: Adresse) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 24,
          }}
          renderItem={({ item }: { item: Adresse }) => <AdresseCard item={item} />}
          getItemLayout={(_: unknown, index: number) => ({ length: 94, offset: 94 * index, index })}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}
          removeClippedSubviews
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color="#C0392B" style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
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
