import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Domaine, useVins } from "../../vins";
import { Cave } from "../types";
import { CaveHeader } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

function DomaineRow({ domaine, isLast }: { domaine: Domaine; isLast: boolean }) {
  const router = useRouter();
  const subtitle = [domaine.vigneron, domaine.village].filter(Boolean).join(" · ");

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => router.push(`/domaine/${domaine.id}`)}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowNom} numberOfLines={1}>
          {domaine.nom}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={styles.rowCount}>{domaine.vins.length}</Text>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
      {!isLast && <View style={styles.separator} />}
    </Pressable>
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
          <DomaineRow key={d.id} domaine={d} isLast={i === domaines.length - 1} />
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
    paddingBottom: 12,
  },

  row: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  rowPressed: { backgroundColor: "#F2F2F7" },
  rowLeft: { flex: 1, marginRight: 8 },
  rowNom: { fontSize: 17, fontWeight: "600", color: "#1C1C1E", lineHeight: 22 },
  rowSub: { fontSize: 13, color: "#8E8E93", lineHeight: 18, marginTop: 1 },
  rowCount: { fontSize: 15, color: "#8E8E93", marginRight: 8 },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
    backgroundColor: "#C6C6C8",
  },

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
