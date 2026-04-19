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
        latitude: 50.6292,
        longitude: 3.0573,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
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
