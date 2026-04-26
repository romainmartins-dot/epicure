import { StyleSheet, Text, View } from "react-native";

import { Domaine } from "../types";
import { VinListItem } from "./VinListItem";

interface Props {
  domaine: Domaine;
}

export function DomaineSection({ domaine }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nom}>{domaine.nom}</Text>
        <Text style={styles.vigneron}>
          {domaine.vigneron} · {domaine.village}
        </Text>
      </View>
      <View style={styles.list}>
        {domaine.vins.map((vin) => (
          <VinListItem key={vin.id} vin={vin} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  nom: { fontSize: 17, fontWeight: "700", color: "#1A1A1A" },
  vigneron: { fontSize: 13, color: "#777", marginTop: 2 },
  list: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
});
