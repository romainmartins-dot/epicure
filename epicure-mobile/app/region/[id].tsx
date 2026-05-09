import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { DomaineAvatar } from "../../src/features/domaines/components/DomaineAvatar";
import { useDomainesByRegion } from "../../src/features/domaines/hooks/useDomainesByRegion";
import type { Domaine } from "../../src/features/domaines/types";
import { REGION_NOM_BY_ID } from "../../src/features/regions/data/regions";

const ROW_HEIGHT = 60;

// ─── DomaineRow ──────────────────────────────────────────────────────────────

function DomaineRow({ domaine, separateur }: { domaine: Domaine; separateur: boolean }) {
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
      onPress={() => router.push(`/domaine/${domaine.id}` as Href)}
    >
      <View style={styles.avatarWrapper}>
        <DomaineAvatar nom={domaine.nom} photoUrl={domaine.photo_url} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.domNom, { color: nomColor }]} numberOfLines={1}>
          {domaine.nom}
        </Text>
        {(domaine.vigneron || domaine.village) && (
          <Text style={styles.domMeta} numberOfLines={1}>
            {[domaine.vigneron, domaine.village].filter(Boolean).join(" · ")}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
      {separateur && <View style={[styles.rowSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

// ─── RegionScreen ─────────────────────────────────────────────────────────────

export default function RegionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const regionNom = REGION_NOM_BY_ID[id] ?? id;
  const { domaines } = useDomainesByRegion(regionNom);

  const sorted = useMemo(
    () => [...domaines].sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    [domaines],
  );

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const borderColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: borderColor }]}
      >
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={isDark ? "#FFFFFF" : "#1C1C1E"} />
          <Text style={[styles.backLabel, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}>Vins</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: titleColor }]} numberOfLines={1}>
          {regionNom}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 49 + 16 }}
        renderItem={({ item, index }) => (
          <DomaineRow domaine={item} separateur={index < sorted.length - 1} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>Aucun domaine dans cette région</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  backLabel: {
    fontSize: 17,
    fontWeight: "400",
    marginLeft: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },

  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarWrapper: { marginRight: 12 },
  rowContent: { flex: 1, justifyContent: "center", marginRight: 8 },
  domNom: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  domMeta: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 18,
    marginTop: 2,
  },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

  empty: { paddingTop: 80, alignItems: "center" },
  emptyTxt: { fontSize: 17, fontWeight: "400", color: "#8E8E93" },
});
