import { useMemo } from "react";

import MapView, { Marker } from "react-native-maps";

import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, selected, onMarkerClick }: Props) {
  const coords = useMemo(
    () =>
      new Map(
        adresses.map((a) => [
          a.id,
          { latitude: parseFloat(a.latitude), longitude: parseFloat(a.longitude) },
        ]),
      ),
    [adresses],
  );

  return (
    <MapView
      style={{ flex: 1 }}
      showsPointsOfInterest={false}
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
          coordinate={coords.get(item.id)!}
          title={item.nom}
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </MapView>
  );
}
