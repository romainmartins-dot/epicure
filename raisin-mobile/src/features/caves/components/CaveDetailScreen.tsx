import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import { Domaine, Vin, useVins } from "../../vins";
import { Cave } from "../types";
import { CaveHeader } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

type Section = { domaine: Domaine; data: Vin[] };

interface Props {
  cave: Cave | null;
  loading: boolean;
}

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

const TYPE_COLORS: Record<string, string> = {
  blanc: "#F0A500",
  rouge: "#C0392B",
  rose: "#E07080",
  petillant: "#5B9BD5",
  doux: "#8E44AD",
};

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

  const sections: Section[] = domaines.map((d) => ({ domaine: d, data: d.vins }));

  return (
    <SectionList<Vin, Section>
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VinRow vin={item} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNom}>{section.domaine.nom}</Text>
          <Text style={styles.sectionVigneron}>
            {section.domaine.vigneron} · {section.domaine.village}
          </Text>
        </View>
      )}
      ListHeaderComponent={
        <>
          <CaveHeader id={cave.id} />
          <CaveInfo cave={cave} />
          {!vinsLoading && domaines.length > 0 && (
            <Text style={styles.vinsTitle}>Vins disponibles</Text>
          )}
        </>
      }
      ListEmptyComponent={
        vinsLoading ? (
          <ActivityIndicator color="#C0392B" style={styles.loader} />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
          </View>
        )
      }
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorTxt: { fontSize: 15, color: "#777" },
  vinsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  sectionNom: { fontSize: 17, fontWeight: "700", color: "#1A1A1A" },
  sectionVigneron: { fontSize: 13, color: "#777", marginTop: 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  rowPressed: { backgroundColor: "#F2F2F7" },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  rowInfo: { flex: 1 },
  cuvee: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  appellation: { fontSize: 12, color: "#777", marginTop: 1 },
  millesime: { fontSize: 13, color: "#AEAEB2" },
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
