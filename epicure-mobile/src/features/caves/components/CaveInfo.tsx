import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { typeCouleur, typeLabel } from "../../../shared/utils/formatters";
import { CurateurSignature } from "../../curateurs";
import { Cave } from "../types";

interface Props {
  cave: Cave;
}

export function CaveInfo({ cave }: Props) {
  const isDark = useColorScheme() === "dark";
  const couleur = typeCouleur(cave.type);
  const label = typeLabel(cave.type);
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const bodyColor = isDark ? "#EBEBF5" : "#3C3C43";

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: couleur + "14" }]}>
        <Text style={[styles.badgeTxt, { color: couleur }]}>{label.toUpperCase()}</Text>
      </View>

      <Text style={[styles.nom, { color: nomColor }]}>{cave.nom}</Text>

      <Text style={styles.adresse}>
        {cave.adresse ? `${cave.adresse}, ` : ""}
        {cave.ville}
      </Text>

      {cave.description ? (
        <Text style={[styles.description, { color: bodyColor }]}>{cave.description}</Text>
      ) : null}

      <CurateurSignature caveId={cave.id} caveNom={cave.nom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 0 },
  badge: {
    marginTop: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeTxt: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  nom: { fontSize: 28, fontWeight: "700", lineHeight: 34, marginTop: 12 },
  adresse: { fontSize: 15, color: "#8E8E93", lineHeight: 20, marginTop: 6 },
  description: { fontSize: 15, lineHeight: 24, marginTop: 24 },
});
