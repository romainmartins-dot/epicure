import { Platform } from "react-native";

import { Adresse } from "../../adresses/types";
import PanelNative from "./PanelNative";
import PanelWeb from "./PanelWeb";

interface Props {
  selected: Adresse | null;
  onClose: () => void;
}

export default function Panel(props: Props) {
  if (Platform.OS === "web") return <PanelWeb {...props} />;
  return <PanelNative {...props} />;
}
