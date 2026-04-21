import { useMemo } from "react";

import ClusteredMapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { INITIAL_REGION } from "../config/map";
import { Adresse, AdresseType } from "../utils/types";

const PIN_COLOR: Record<AdresseType, string> = {
  cave: "#C0392B",
  restaurant: "#27AE60",
  bar: "#2980B9",
};

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
      initialRegion={INITIAL_REGION}
    >
      {validAdresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={coords.get(item.id)!}
          pinColor={PIN_COLOR[item.type] ?? PIN_COLOR.cave}
          title={item.nom}
          onPress={() => onMarkerClick(item)}
        />
      ))}
    </ClusteredMapView>
  );
}
