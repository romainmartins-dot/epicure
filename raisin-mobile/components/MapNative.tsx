import { useMemo } from "react";

import MapView, { Marker } from "react-native-maps";

import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

const INITIAL_REGION = {
  latitude: 50.633,
  longitude: 3.058,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
} as const;

export default function MapNative({ adresses, onMarkerClick }: Props) {
  const markers = useMemo(
    () =>
      adresses
        .map((item) => ({
          id: item.id,
          coordinate: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          },
          item,
        }))
        .filter(({ coordinate }) => !isNaN(coordinate.latitude) && !isNaN(coordinate.longitude)),
    [adresses],
  );

  return (
    <MapView style={{ flex: 1 }} initialRegion={INITIAL_REGION}>
      {markers.map(({ id, coordinate, item }) => (
        <Marker
          key={id}
          coordinate={coordinate}
          pinColor="#C0392B"
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </MapView>
  );
}
