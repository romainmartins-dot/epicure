import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { DomaineAvatar } from "../../domaines/components/DomaineAvatar";
import { VinFlat } from "../../vins/hooks/useAllVins";
import { useAllFavoriVins } from "../hooks/useAllFavoriVins";

const ROW_HEIGHT = 64;

function VinRow({ vin, separateur }: { vin: VinFlat; separateur: boolean }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? (isDark ? "#2C2C2E" : "#F2F2F7") : bgColor },
      ]}
      onPressIn={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      onPress={() => router.push(`/vin/${vin.id}` as Href)}
    >
      <DomaineAvatar nom={vin.domaine_nom} photoUrl={vin.domaine_photo_url} size={44} />
      <View style={styles.rowContent}>
        <Text style={[styles.cuvee, { color: nomColor }]} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {vin.appellation} · {vin.domaine_nom}
        </Text>
      </View>
      <Text style={styles.millesime}>{vin.millesime ?? "Assemblage"}</Text>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" style={styles.chevron} />
      {separateur && <View style={[styles.rowSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

function EmptyState() {
  const isDark = useColorScheme() === "dark";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: titleColor }]}>Aucun favori</Text>
      <Text style={styles.emptySubtitle}>
        Touchez le cœur sur une fiche vin pour la sauvegarder ici
      </Text>
    </View>
  );
}

export function FavorisScreen() {
  const { favoriteVins, loading } = useAllFavoriVins();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";

  const count = favoriteVins.length;
  const subtitle =
    count === 0
      ? "Aucun vin sauvegardé"
      : count === 1
        ? "1 vin sauvegardé"
        : `${count} vins sauvegardés`;

  if (loading) return <View style={[styles.container, { backgroundColor: bgColor }]} />;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.largeTitle, { color: titleColor }]}>Mes favoris</Text>
        <Text style={styles.subheadline}>{subtitle}</Text>
      </View>

      {count === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favoriteVins}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 49 + 16 }}
          renderItem={({ item, index }) => <VinRow vin={item} separateur={index < count - 1} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700",
    letterSpacing: 0.37,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    color: "#8E8E93",
    marginTop: 4,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },

  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  rowContent: { flex: 1, justifyContent: "center" },
  cuvee: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  meta: { fontSize: 13, fontWeight: "400", color: "#8E8E93", lineHeight: 18, marginTop: 2 },
  millesime: { fontSize: 15, fontWeight: "400", color: "#8E8E93", marginRight: 6 },
  chevron: { marginLeft: 2 },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 72,
    right: 0,
    height: 0.5,
  },
});
