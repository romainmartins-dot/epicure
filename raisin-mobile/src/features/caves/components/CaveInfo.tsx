import { StyleSheet, Text, View } from "react-native";

import { typeCouleur, typeLabel } from "../../../shared/utils/formatters";
import { Cave } from "../types";

interface Props {
  cave: Cave;
}

export function CaveInfo({ cave }: Props) {
  const couleur = typeCouleur(cave.type);
  const label = typeLabel(cave.type);

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: couleur + "18" }]}>
        <Text style={[styles.badgeTxt, { color: couleur }]}>{label.toUpperCase()}</Text>
      </View>

      <Text style={styles.nom}>{cave.nom}</Text>

      <Text style={styles.adresse}>
        {cave.adresse ? `${cave.adresse}, ` : ""}
        {cave.ville}
      </Text>

      {cave.description ? <Text style={styles.description}>{cave.description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
  nom: { fontSize: 26, fontWeight: "800", color: "#1A1A1A", lineHeight: 32 },
  adresse: { fontSize: 15, color: "#777", lineHeight: 20 },
  description: { fontSize: 15, color: "#555", lineHeight: 22, marginTop: 4 },
});
