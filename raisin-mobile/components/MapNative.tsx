import { Dimensions } from "react-native";

import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

const LILLE = { latitude: 50.634, longitude: 3.063, latitudeDelta: 0.3, longitudeDelta: 0.3 };
const CLUSTER_RADIUS = Math.round(Dimensions.get("window").width * 0.16);

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
          title={item.nom}
          tracksViewChanges={false}
          onCalloutPress={() => onMarkerClick(item)}
        />
      ))}
    </MapView>
  );
}
