import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";

import { useRouter } from "expo-router";

import { Domaine, Vin, useVins } from "../../vins";
import { Cave } from "../types";
import { CaveHeader } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

type Row =
  | { kind: "header"; domaine: Domaine; key: string }
  | { kind: "vin"; vin: Vin; key: string };

const TYPE_COLORS: Record<string, string> = {
  blanc: "#F0A500",
  rouge: "#C0392B",
  rose: "#E07080",
  petillant: "#5B9BD5",
  doux: "#8E44AD",
};

function VinRow({ vin }: { vin: Vin }) {
  const router = useRouter();
  const millesimeLabel = vin.millesime
    ? String(vin.millesime)
    : (vin.millesimes_assemblage?.join(" · ") ?? "—");

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => router.push(`/vin/${vin.id}`)}
    >
      <View style={[styles.dot, { backgroundColor: TYPE_COLORS[vin.type] ?? "#999" }]} />
      <View style={styles.rowInfo}>
        <Text style={styles.cuvee} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={styles.appellation} numberOfLines={1}>
          {vin.appellation}
        </Text>
      </View>
      <Text style={styles.millesime}>{millesimeLabel}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function DomaineHeader({ domaine }: { domaine: Domaine }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionNom}>{domaine.nom}</Text>
      <Text style={styles.sectionVigneron}>
        {domaine.vigneron} · {domaine.village}
      </Text>
    </View>
  );
}

interface Props {
  cave: Cave | null;
  loading: boolean;
}

export function CaveDetailScreen({ cave, loading }: Props) {
  const { domaines, loading: vinsLoading } = useVins(cave?.id ?? 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C0392B" />
      </View>
    );
  }

  if (!cave) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTxt}>Adresse introuvable</Text>
      </View>
    );
  }

  const rows: Row[] = domaines.flatMap((d) => [
    { kind: "header", domaine: d, key: `h-${d.id}` },
    ...d.vins.map((v) => ({ kind: "vin" as const, vin: v, key: v.id })),
  ]);

  return (
    <FlatList<Row>
      data={rows}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) =>
        item.kind === "header" ? (
          <DomaineHeader domaine={item.domaine} />
        ) : (
          <VinRow vin={item.vin} />
        )
      }
      ListHeaderComponent={
        <>
          <CaveHeader id={cave.id} />
          <View style={styles.card}>
            <View style={styles.pullIndicator} />
            <CaveInfo cave={cave} />
            {!vinsLoading && domaines.length > 0 && (
              <Text style={styles.vinsTitle}>Vins disponibles</Text>
            )}
            {vinsLoading && <ActivityIndicator color="#C0392B" style={styles.loader} />}
          </View>
        </>
      }
      ListEmptyComponent={
        !vinsLoading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#E5E5EA" },
  content: { paddingBottom: 80, backgroundColor: "#fff" },

  card: {
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  pullIndicator: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C7C7CC",
    marginBottom: 8,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },
  vinsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  sectionNom: { fontSize: 17, fontWeight: "700", color: "#1C1C1E" },
  sectionVigneron: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  rowPressed: { backgroundColor: "#F2F2F7" },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  rowInfo: { flex: 1 },
  cuvee: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  appellation: { fontSize: 12, color: "#8E8E93", marginTop: 1 },
  millesime: { fontSize: 13, color: "#C7C7CC" },
  chevron: { fontSize: 18, color: "#C7C7CC", lineHeight: 22 },
  loader: { marginTop: 24 },
  empty: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
  },
  emptyTxt: { fontSize: 15, color: "#AEAEB2" },
});
