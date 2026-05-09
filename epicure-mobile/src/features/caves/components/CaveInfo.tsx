import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { Cave } from "../types";

const TYPE_SUBTITLE: Record<string, string> = {
  cave: "Cave à vins",
  restaurant: "Restaurant",
  bar: "Bar à vins",
};

interface Props {
  cave: Cave;
}

export function CaveInfo({ cave }: Props) {
  const isDark = useColorScheme() === "dark";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const bodyColor = isDark ? "#EBEBF5" : "#3C3C43";

  const typeSubtitle = TYPE_SUBTITLE[cave.type] ?? cave.type;

  return (
    <View style={styles.container}>
      <Text style={[styles.nom, { color: nomColor }]}>{cave.nom}</Text>

      <Text style={styles.sousTitreType}>
        {typeSubtitle} · {cave.ville}
      </Text>

      {cave.adresse ? (
        <Text style={styles.adresse}>
          {cave.adresse} · {cave.ville}
        </Text>
      ) : null}

      {cave.description ? (
        <Text style={[styles.description, { color: bodyColor }]}>{cave.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 0 },
  nom: { fontSize: 34, fontWeight: "700", lineHeight: 41, letterSpacing: 0.37, marginTop: 24 },
  sousTitreType: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 20,
    marginTop: 4,
  },
  adresse: { fontSize: 15, fontWeight: "400", color: "#8E8E93", lineHeight: 20, marginTop: 2 },
  description: { fontSize: 17, lineHeight: 26, marginTop: 24 },
});
