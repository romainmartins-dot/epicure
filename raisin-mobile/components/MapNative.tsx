import MapView, { Marker } from "react-native-maps";

import { typeCouleur } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, onMarkerClick }: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 46.5,
        longitude: 2.5,
        latitudeDelta: 8,
        longitudeDelta: 8,
      }}
    >
      {adresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          pinColor={typeCouleur(item.type)}
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </MapView>
  );
}
