import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import ClusteredMapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { INITIAL_REGION } from "../config/map";
import { Adresse, AdresseType } from "../utils/types";

const PIN_COLOR: Record<AdresseType, string> = {
  cave: "#C0392B",
  restaurant: "#27AE60",
  bar: "#2980B9",
};

const PinMarker = React.memo(({ color }: { color: string }) => (
  <View style={pin.container}>
    <View style={[pin.head, { backgroundColor: color }]} />
    <View style={[pin.tip, { borderTopColor: color }]} />
  </View>
));
PinMarker.displayName = "PinMarker";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function MapNative({ adresses, onMarkerClick }: Props) {
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
      style={StyleSheet.absoluteFill}
      showsPointsOfInterest={false}
      animationEnabled={false}
      clusterColor="#C0392B"
      clusterTextColor="#FFFFFF"
      maxZoom={12}
      initialRegion={INITIAL_REGION}
    >
      {validAdresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={coords.get(item.id)!}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          onPress={() => onMarkerClick(item)}
        >
          <PinMarker color={PIN_COLOR[item.type] ?? PIN_COLOR.cave} />
        </Marker>
      ))}
    </ClusteredMapView>
  );
}

const pin = StyleSheet.create({
  container: { alignItems: "center" },
  head: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
  },
});
