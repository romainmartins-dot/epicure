import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AdresseCard from "../components/AdresseCard";
import Header from "../components/Header";
import Map from "../components/Map";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import { useAdresses } from "../hooks/useAdresses";
import { useAdressesList } from "../hooks/useAdressesList";
import { Adresse } from "../utils/types";

export default function Index() {
  const { adresses, loading } = useAdresses();
  const [vue, setVue] = useState<"carte" | "liste">("carte");
  const [recherche, setRecherche] = useState("");
  const [selected, setSelected] = useState<Adresse | null>(null);
  const mapRef = useRef<any>(null);

  const {
    adresses: listeAdresses,
    loading: listeLoading,
    loadingMore,
    loadMore,
    hasMore,
  } = useAdressesList(recherche || undefined);

  const rechercherVille = useCallback(() => {
    if (!mapRef.current || !recherche) return;
    const q = recherche.toLowerCase();
    const premier = adresses.find((a) => a.ville.toLowerCase().includes(q));
    if (!premier) return;
    mapRef.current.setView([parseFloat(premier.latitude), parseFloat(premier.longitude)], 14);
  }, [adresses, recherche]);

  const handleMapReady = useCallback((m: any) => {
    mapRef.current = m;
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ fontSize: 60 }}>🍷</Text>
        <Text style={styles.loaderText}>Raisin</Text>
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 20 }} />
      </View>
    );

  if (vue === "carte") {
    return (
      <View style={styles.container}>
        <Map
          adresses={adresses}
          selected={selected}
          onMarkerClick={setSelected}
          onMapReady={handleMapReady}
        />
        <Panel selected={selected} onClose={handleClose} />
        {!selected && (
          <TouchableOpacity style={styles.listBtn} onPress={() => setVue("liste")}>
            <Text style={styles.listBtnTxt}>≡ Liste</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header vue={vue} setVue={setVue} />
      <SearchBar recherche={recherche} setRecherche={setRecherche} onSubmit={rechercherVille} />
      {listeLoading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={listeAdresses}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => <AdresseCard item={item} />}
          getItemLayout={(_, index) => ({ length: 94, offset: 94 * index, index })}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a0a00",
  },
  loaderText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    letterSpacing: 2,
  },
  listBtn: {
    position: "absolute",
    bottom: 32,
    left: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listBtnTxt: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
});
