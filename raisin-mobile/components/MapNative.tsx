import { Dimensions, StyleSheet, Text, View } from "react-native";

import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { typeCouleur, typeEmoji } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

// Lille globale : assez dézoomé pour que les 19 adresses tiennent en 1 cluster
const LILLE = { latitude: 50.634, longitude: 3.063, latitudeDelta: 0.3, longitudeDelta: 0.3 };

// À delta=0.3, Gabbro (outlier nord, ~2.3km) occupe ~58px → radius=65 suffit pour tout regrouper
const CLUSTER_RADIUS = Math.round(Dimensions.get("window").width * 0.16);

function MarkerPin({ item }: { item: Adresse }) {
  return (
    <View style={[styles.pin, { backgroundColor: typeCouleur(item.type) }]}>
      <Text style={styles.emoji}>{typeEmoji(item.type)}</Text>
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
          onPress={() => onMarkerClick(item)}
        >
          <MarkerPin item={item} />
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  emoji: { fontSize: 13 },
});
