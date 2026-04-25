import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import ClusteredMapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";

import { INITIAL_REGION } from "../../../config";
import { Adresse } from "../../adresses/types";

const PIN_COLOR = "#C0392B";
const PIN_SIZE = 28;
const TIP_W = 6;
const TIP_H = 9;

const PinMarker = memo(({ nom }: { nom: string }) => (
  <View style={pin.container}>
    <View style={pin.head}>
      <View style={pin.dot} />
    </View>
    <View style={pin.tip} />
    <Text style={pin.label} numberOfLines={1}>
      {nom}
    </Text>
  </View>
));

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
      style={{ flex: 1 }}
      showsPointsOfInterest={false}
      animationEnabled={false}
      clusterColor={PIN_COLOR}
      clusterTextColor="#FFFFFF"
      initialRegion={INITIAL_REGION}
    >
      {validAdresses.map((item) => (
        <Marker
          key={item.id}
          coordinate={coords.get(item.id)!}
          tracksViewChanges={false}
          onPress={() => onMarkerClick(item)}
        >
          <PinMarker nom={item.nom} />
        </Marker>
      ))}
    </ClusteredMapView>
  );
}

const pin = StyleSheet.create({
  container: { alignItems: "center" },
  head: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    backgroundColor: PIN_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A1A",
    textShadowColor: "rgba(255,255,255,0.95)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
    maxWidth: 90,
    textAlign: "center",
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: TIP_W,
    borderRightWidth: TIP_W,
    borderTopWidth: TIP_H,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: PIN_COLOR,
    marginTop: -1,
  },
});
