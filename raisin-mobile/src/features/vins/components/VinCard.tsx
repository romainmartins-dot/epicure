import { StyleSheet, Text, View } from "react-native";

import { Vin } from "../types";

interface Props {
  vin: Vin;
}

export function VinCard({ vin }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.domaine}>{vin.domaine}</Text>
        <Text style={styles.vigneron}>{vin.vigneron}</Text>
      </View>

      <Text style={styles.cuvee}>
        {vin.cuvee} <Text style={styles.millesime}>{vin.millesime}</Text>
      </Text>

      {vin.description ? <Text style={styles.description}>{vin.description}</Text> : null}

      {vin.accords.length > 0 ? (
        <View style={styles.accordsRow}>
          {vin.accords.map((accord) => (
            <View key={accord} style={styles.accordChip}>
              <Text style={styles.accordTxt}>{accord}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.etiquette}>
        {vin.so2_libre ? (
          <View style={styles.etiquetteItem}>
            <Text style={styles.etiquetteLabel}>SO₂ libre</Text>
            <Text style={styles.etiquetteVal}>{vin.so2_libre}</Text>
          </View>
        ) : null}
        {vin.so2_total ? (
          <View style={styles.etiquetteItem}>
            <Text style={styles.etiquetteLabel}>SO₂ total</Text>
            <Text style={styles.etiquetteVal}>{vin.so2_total}</Text>
          </View>
        ) : null}
        {vin.mise ? (
          <View style={styles.etiquetteItem}>
            <Text style={styles.etiquetteLabel}>Mise</Text>
            <Text style={styles.etiquetteVal}>{vin.mise}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  header: { gap: 2 },
  domaine: { fontSize: 13, fontWeight: "600", color: "#555", letterSpacing: 0.2 },
  vigneron: { fontSize: 12, color: "#AEAEB2" },
  cuvee: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  millesime: { fontSize: 20, fontWeight: "400", color: "#555" },
  description: { fontSize: 14, color: "#444", lineHeight: 21 },
  accordsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  accordChip: {
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  accordTxt: { fontSize: 12, color: "#555" },
  etiquette: {
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 10,
    marginTop: 2,
  },
  etiquetteItem: { gap: 2 },
  etiquetteLabel: {
    fontSize: 10,
    color: "#AEAEB2",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  etiquetteVal: { fontSize: 12, fontWeight: "600", color: "#3A3A3C" },
});
