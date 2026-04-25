import { StyleSheet, Text, View } from "react-native";

export function VinsListPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vins disponibles</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTxt}>Liste des vins à venir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 8 },
  title: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  placeholder: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  placeholderTxt: { fontSize: 15, color: "#AEAEB2" },
});
