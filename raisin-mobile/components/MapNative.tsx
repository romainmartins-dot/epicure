import MapView, { Marker } from "react-native-maps";

import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, onMarkerClick }: Props) {
  return (
    <MapView style={{ flex: 1 }}>
      {adresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </MapView>
  );
}
