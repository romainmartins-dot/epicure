import { Dimensions, StyleSheet, Text, View } from "react-native";

import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { typeCouleur } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

const LILLE = { latitude: 50.634, longitude: 3.063, latitudeDelta: 0.3, longitudeDelta: 0.3 };
const CLUSTER_RADIUS = Math.round(Dimensions.get("window").width * 0.16);

function MarkerPin({ item }: { item: Adresse }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: typeCouleur(item.type) }]} />
      <Text style={styles.label} numberOfLines={1}>
        {item.nom}
      </Text>
    </View>
  );
}

export default function MapNative({ adresses, onMarkerClick }: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={LILLE}
      clusterColor="#C0392B"
      radius={CLUSTER_RADIUS}
      animationEnabled={false}
      spiralEnabled={false}
    >
      {adresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          tracksViewChanges={false}
          anchor={{ x: 0.5, y: 0.5 }}
          onPress={() => onMarkerClick(item)}
        >
          <MarkerPin item={item} />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  label: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A1A",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: "hidden",
    maxWidth: 120,
  },
});
