import { Platform } from "react-native";

import { Adresse } from "../../adresses/types";
import MapNative from "./MapNative";
import MapWeb from "./MapWeb";

interface Props {
  adresses: Adresse[];
  selected: Adresse | null;
  onMarkerClick: (item: Adresse) => void;
}

export default function Map(props: Props) {
  if (Platform.OS === "web") return <MapWeb {...props} />;
  return (
    <MapNative
      adresses={props.adresses}
      selected={props.selected}
      onMarkerClick={props.onMarkerClick}
    />
  );
}
