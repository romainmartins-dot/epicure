import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useVins } from "../hooks/useVins";
import { VinCard } from "./VinCard";

interface Props {
  caveId: number;
}

export function VinsList({ caveId }: Props) {
  const { vins, loading } = useVins(caveId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vins disponibles</Text>
      {loading ? (
        <ActivityIndicator color="#C0392B" />
      ) : vins.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {vins.map((vin) => (
            <VinCard key={vin.id} vin={vin} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 8 },
  title: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  list: { gap: 12 },
  empty: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyTxt: { fontSize: 15, color: "#AEAEB2" },
});
