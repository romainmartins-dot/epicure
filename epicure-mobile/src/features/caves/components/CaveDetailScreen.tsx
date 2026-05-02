import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Domaine, Vin, useVins } from "../../vins";
import { WINE_TYPE_COLORS } from "../../vins/data/wineTypeColors";
import { Cave } from "../types";
import { CaveHeader } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

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
      <View style={[styles.dot, { backgroundColor: WINE_TYPE_COLORS[vin.type] ?? "#C7C7CC" }]} />
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

function DomaineSection({
  domaine,
  isFirst,
  isExpanded,
  onPress,
}: {
  domaine: Domaine;
  isFirst: boolean;
  isExpanded: boolean;
  onPress: () => void;
}) {
  const router = useRouter();

  return (
    <View style={isFirst ? styles.domaineFirst : styles.domaineOther}>
      <Pressable
        style={({ pressed }) => [styles.domaineHeader, pressed && styles.domaineHeaderPressed]}
        onPress={onPress}
      >
        <View style={styles.domaineHeaderLeft}>
          <Text style={styles.sectionNom}>{domaine.nom}</Text>
          {isExpanded && (
            <Text style={styles.sectionVigneron}>
              {domaine.vigneron} · {domaine.village}
            </Text>
          )}
        </View>
        <View style={styles.domaineHeaderRight}>
          <Pressable
            style={({ pressed }) => [styles.domaineLink, pressed && { opacity: 0.5 }]}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/domaine/${domaine.id}`);
            }}
            hitSlop={8}
          >
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#C0392B" />
          </Pressable>
          <Text style={styles.vinCount}>{domaine.vins.length}</Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={13} color="#C7C7CC" />
        </View>
      </Pressable>

      {isExpanded && domaine.vins.map((v) => <VinRow key={v.id} vin={v} />)}
    </View>
  );
}

interface Props {
  cave: Cave | null;
  loading: boolean;
}

export function CaveDetailScreen({ cave, loading }: Props) {
  const { domaines, loading: vinsLoading } = useVins(cave?.id ?? 0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <CaveHeader id={cave.id} />
      <View style={styles.card}>
        <CaveInfo cave={cave} />

        {!vinsLoading && domaines.length > 0 && <Text style={styles.vinsTitle}>RÉFÉRENCÉS</Text>}
        {vinsLoading && <ActivityIndicator color="#C0392B" style={styles.loader} />}

        {domaines.map((d, i) => (
          <DomaineSection
            key={d.id}
            domaine={d}
            isFirst={i === 0}
            isExpanded={expanded.has(d.id)}
            onPress={() => toggle(d.id)}
          />
        ))}

        {!vinsLoading && domaines.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 80, backgroundColor: "#fff" },

  card: {
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  vinsTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },

  domaineFirst: { marginTop: 8 },
  domaineOther: { marginTop: 40 },

  domaineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#C6C6C8",
  },
  domaineHeaderPressed: { backgroundColor: "#F2F2F7" },
  domaineHeaderLeft: { flex: 1, marginRight: 12 },
  domaineHeaderRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  domaineLink: { padding: 2 },

  sectionNom: { fontSize: 22, fontWeight: "700", color: "#1C1C1E", lineHeight: 28 },
  sectionVigneron: { fontSize: 15, color: "#8E8E93", lineHeight: 20, marginTop: 4 },
  vinCount: { fontSize: 13, color: "#C7C7CC" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  rowPressed: { backgroundColor: "#F2F2F7" },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
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
