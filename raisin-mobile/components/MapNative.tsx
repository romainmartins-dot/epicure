import { useMemo } from "react";

import ClusteredMapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { Adresse } from "../utils/types";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, selected, onMarkerClick }: Props) {
  const validAdresses = useMemo(
    () =>
      adresses.filter((a) => {
        const lat = parseFloat(a.latitude);
        const lng = parseFloat(a.longitude);
        return !isNaN(lat) && !isNaN(lng);
      }),
    [adresses],
  );

  const coords = useMemo(
    () =>
      new Map(
        validAdresses.map((a) => [
          a.id,
          { latitude: parseFloat(a.latitude), longitude: parseFloat(a.longitude) },
        ]),
      ),
    [validAdresses],
  );

  return (
    <ClusteredMapView
      style={{ flex: 1 }}
      showsPointsOfInterest={false}
      animationEnabled={false}
      clusterColor="#C0392B"
      clusterTextColor="#FFFFFF"
      maxZoom={13}
      initialRegion={{
        latitude: 50.6292,
        longitude: 3.0573,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }}
    >
      {validAdresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={coords.get(item.id)!}
          title={item.nom}
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </ClusteredMapView>
  );
}
