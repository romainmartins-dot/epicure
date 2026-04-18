import { Platform } from "react-native";

import { Adresse } from "../utils/types";
import MapNative from "./MapNative";
import MapWeb from "./MapWeb";

interface Props {
  adresses: Adresse[];
  onMarkerClick: (item: Adresse) => void;
  onMapReady?: (map: any) => void;
}

export default function Map(props: Props) {
  if (Platform.OS === "web") return <MapWeb {...props} />;
  return <MapNative adresses={props.adresses} onMarkerClick={props.onMarkerClick} />;
}
