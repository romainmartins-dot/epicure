import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useVins } from "../hooks/useVins";
import { DomaineSection } from "./DomaineSection";

interface Props {
  caveId: number;
}

export function VinsList({ caveId }: Props) {
  const { domaines, loading } = useVins(caveId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vins disponibles</Text>
      {loading ? (
        <ActivityIndicator color="#C0392B" style={styles.loader} />
      ) : domaines.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
        </View>
      ) : (
        domaines.map((domaine) => <DomaineSection key={domaine.id} domaine={domaine} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 8, paddingBottom: 32 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  loader: { marginTop: 24 },
  empty: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    alignItems: "center",
  },
  emptyTxt: { fontSize: 15, color: "#AEAEB2" },
});
