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
const RADIUS = Math.round(Dimensions.get("window").width * 0.16);

export default function MapNative({ adresses, onMarkerClick }: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={LILLE}
      clusterColor="#C0392B"
      radius={RADIUS}
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
          anchor={{ x: 0.5, y: 0 }}
          onPress={() => onMarkerClick(item)}
        >
          <View style={styles.pin}>
            <View style={[styles.dot, { backgroundColor: typeCouleur(item.type) }]} />
            <Text style={styles.label} numberOfLines={1}>
              {item.nom}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { alignItems: "center", gap: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#444",
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
    overflow: "hidden",
    maxWidth: 100,
  },
});
