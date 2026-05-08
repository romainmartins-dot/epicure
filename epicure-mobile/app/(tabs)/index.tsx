import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";

import Animated, { FadeIn } from "react-native-reanimated";

import { Map, useAdresses } from "../../src/features/map";
import Header from "../../src/features/map/components/Header";
import SearchBar from "../../src/features/map/components/SearchBar";

export default function CarteTab() {
  const { adresses, loading } = useAdresses();
  const [recherche, setRecherche] = useState("");
  const router = useRouter();
  const mapRef = useRef<any>(null);

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

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Header />
      <SearchBar recherche={recherche} setRecherche={setRecherche} onSubmit={rechercherVille} />
      <Animated.View entering={FadeIn.duration(300)} style={styles.mapContainer}>
        <Map
          adresses={adresses}
          selected={null}
          onMarkerClick={(item) =>
            router.push(item.type === "restaurant" ? `/restaurant/${item.id}` : `/cave/${item.id}`)
          }
          onMapReady={handleMapReady}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  mapContainer: { flex: 1, position: "relative" },
});
