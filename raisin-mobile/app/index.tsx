import { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";

import AdresseCard from "../components/AdresseCard";
import Header from "../components/Header";
import Legende from "../components/Legende";
import Map from "../components/Map";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import { useAdresses } from "../hooks/useAdresses";
import { useAdressesList } from "../hooks/useAdressesList";
import { Adresse } from "../utils/types";

const isWeb = Platform.OS === "web";

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

  const rechercherVille = () => {
    if (!mapRef.current || !recherche) return;
    const filtrees = adresses.filter((a) =>
      a.ville.toLowerCase().includes(recherche.toLowerCase()),
    );
    if (!filtrees.length) return;
    const premier = filtrees[0];
    mapRef.current.setView([parseFloat(premier.latitude), parseFloat(premier.longitude)], 14);
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ fontSize: 60 }}>🍷</Text>
        <Text style={styles.loaderText}>Raisin</Text>
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 20 }} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Header vue={vue} setVue={setVue} />
      <SearchBar recherche={recherche} setRecherche={setRecherche} onSubmit={rechercherVille} />

      {vue === "carte" ? (
        <Animated.View
          entering={isWeb ? undefined : FadeIn.duration(200)}
          style={{ flex: 1, position: "relative" }}
        >
          <Map
            adresses={adresses}
            onMarkerClick={setSelected}
            onMapReady={(m) => {
              mapRef.current = m;
            }}
          />
          {!selected && <Legende />}
          <Panel selected={selected} onClose={() => setSelected(null)} />
        </Animated.View>
      ) : listeLoading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={listeAdresses}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => <AdresseCard item={item} />}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}
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
});
