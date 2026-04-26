import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";

import { Vin } from "../types";

const TYPE_COLORS: Record<string, string> = {
  blanc: "#F0A500",
  rouge: "#C0392B",
  rose: "#E07080",
  petillant: "#5B9BD5",
  doux: "#8E44AD",
};

interface Props {
  vin: Vin;
}

export function VinListItem({ vin }: Props) {
  const router = useRouter();
  const millesimeLabel = vin.millesime
    ? String(vin.millesime)
    : (vin.millesimes_assemblage?.join(" · ") ?? "—");

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => router.push(`/vin/${vin.id}`)}
    >
      <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[vin.type] ?? "#999" }]} />
      <View style={styles.info}>
        <Text style={styles.cuvee} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={styles.appellation} numberOfLines={1}>
          {vin.appellation}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.millesime}>{millesimeLabel}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  info: { flex: 1 },
  cuvee: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  appellation: { fontSize: 12, color: "#777", marginTop: 1 },
  right: { flexDirection: "row", alignItems: "center", gap: 6 },
  millesime: { fontSize: 13, color: "#AEAEB2" },
  chevron: { fontSize: 18, color: "#C7C7CC", lineHeight: 22 },
});
