import { StyleSheet, Text, View } from "react-native";

import { typeCouleur, typeLabel } from "../utils/formatters";

export default function Legende() {
  const items: [string, string][] = [
    ["cave", "🍾"],
    ["restaurant", "🍽"],
    ["bar", "🍷"],
  ];
  return (
    <View style={styles.legende}>
      {items.map(([type, emoji]) => (
        <View key={type} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: typeCouleur(type) }]} />
          <Text style={styles.txt}>
            {emoji} {typeLabel(type)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legende: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 10,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  txt: { fontSize: 12, color: "#333", fontWeight: "500" },
});
