import { StyleSheet, Text, View } from "react-native";

import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { typeCouleur, typeEmoji } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

const LILLE = {
  latitude: 50.633,
  longitude: 3.063,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

function MarkerPin({ item }: { item: Adresse }) {
  return (
    <View style={[styles.pin, { backgroundColor: typeCouleur(item.type) }]}>
      <Text style={styles.emoji}>{typeEmoji(item.type)}</Text>
    </View>
  );
}

export default function MapNative({ adresses, onMarkerClick }: Props) {
  return (
    <MapView style={{ flex: 1 }} initialRegion={LILLE} clusterColor="#C0392B">
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
