import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { DomaineAvatar } from "../../domaines/components/DomaineAvatar";
import { useAllDomaines } from "../../domaines/hooks/useAllDomaines";
import { REGIONS } from "../data/regions";
import type { Region } from "../data/regions";

// ─── constants ───────────────────────────────────────────────────────────────

const SEARCH_BAR_HEIGHT = 36;
const SEARCH_VERTICAL_MARGIN = 10;
const ROW_HEIGHT = 60;

function normaliser(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// ─── SearchBar ───────────────────────────────────────────────────────────────

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<TextInput | null>;
}

function SearchBar({
  query,
  onQueryChange,
  isFocused,
  onFocus,
  onCancel,
  inputRef,
}: SearchBarProps) {
  const isDark = useColorScheme() === "dark";
  const showCancel = isFocused || query.length > 0;

  const cancelAnim = useRef(new Animated.Value(showCancel ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(cancelAnim, {
      toValue: showCancel ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [showCancel, cancelAnim]);

  const cancelWidth = cancelAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });
  const inputBg = isDark ? "#3A3A3C" : "#E3E3E8";
  const inputColor = isDark ? "#FFFFFF" : "#1C1C1E";

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchInputWrapper, { backgroundColor: inputBg }]}>
        <Ionicons name="search" size={14} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: inputColor }]}
          value={query}
          onChangeText={onQueryChange}
          onFocus={onFocus}
          placeholder="Rechercher un domaine, une région"
          placeholderTextColor="#8E8E93"
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <Animated.View style={{ width: cancelWidth, overflow: "hidden" }}>
        <Pressable onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelTxt}>Annuler</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── RegionRow ───────────────────────────────────────────────────────────────

function RegionRow({
  region,
  count,
  separateur,
}: {
  region: Region;
  count: number;
  separateur: boolean;
}) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.regionRow,
        { backgroundColor: pressed ? (isDark ? "#2C2C2E" : "#F2F2F7") : bgColor },
      ]}
      onPressIn={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      onPress={() => router.push(`/region/${region.id}` as Href)}
    >
      <Text style={[styles.regionNom, { color: nomColor }]} numberOfLines={1}>
        {region.nom}
      </Text>
      <Text style={styles.regionCount}>{count}</Text>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" style={styles.chevron} />
      {separateur && <View style={[styles.rowSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

// ─── DomaineResultRow ────────────────────────────────────────────────────────

interface DomaineResult {
  id: string;
  nom: string;
  vigneron?: string | null;
  village?: string | null;
  photo_url?: string | null;
}

function DomaineResultRow({
  domaine,
  separateur,
}: {
  domaine: DomaineResult;
  separateur: boolean;
}) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.domaineRow,
        { backgroundColor: pressed ? (isDark ? "#2C2C2E" : "#F2F2F7") : bgColor },
      ]}
      onPressIn={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      onPress={() => router.push(`/domaine/${domaine.id}` as Href)}
    >
      <View style={styles.avatarWrapper}>
        <DomaineAvatar nom={domaine.nom} photoUrl={domaine.photo_url} />
      </View>
      <View style={styles.domaineContent}>
        <Text style={[styles.domaineNom, { color: nomColor }]} numberOfLines={1}>
          {domaine.nom}
        </Text>
        {(domaine.vigneron || domaine.village) && (
          <Text style={styles.domaineMeta} numberOfLines={1}>
            {[domaine.vigneron, domaine.village].filter(Boolean).join(" · ")}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" style={styles.chevron} />
      {separateur && <View style={[styles.rowSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

// ─── RegionsScreen ───────────────────────────────────────────────────────────

export function RegionsScreen() {
  const { domaines, total: totalDomaines } = useAllDomaines();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const sectionLabelColor = "#8E8E93";

  const isActive = query.trim().length > 0;

  const countsByRegion = REGIONS.reduce<Record<string, number>>((acc, r) => {
    acc[r.id] = domaines.filter((d) => d.region === r.nom).length;
    return acc;
  }, {});

  const domaineResults = isActive
    ? (() => {
        const q = normaliser(query.trim());
        return domaines.filter(
          (d) =>
            normaliser(d.nom).includes(q) ||
            (d.vigneron ? normaliser(d.vigneron).includes(q) : false) ||
            (d.village ? normaliser(d.village).includes(q) : false) ||
            (d.region ? normaliser(d.region).includes(q) : false) ||
            (d.appellation_principale ? normaliser(d.appellation_principale).includes(q) : false),
        );
      })()
    : [];

  const handleCancel = useCallback(() => {
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ paddingTop: insets.top + 8 }}>
        <Text style={[styles.largeTitle, { color: titleColor, paddingHorizontal: 20 }]}>Vins</Text>
        <Text style={styles.subtitle}>
          {totalDomaines} domaines · {REGIONS.length} régions
        </Text>
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onCancel={handleCancel}
          inputRef={inputRef}
        />
      </View>

      {!isActive && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>PAR RÉGION</Text>
          </View>
          <FlatList
            style={styles.list}
            data={REGIONS}
            keyExtractor={(r) => r.id}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom + 49 + 16 }}
            renderItem={({ item, index }) => (
              <RegionRow
                region={item}
                count={countsByRegion[item.id] ?? 0}
                separateur={index < REGIONS.length - 1}
              />
            )}
          />
        </>
      )}

      {isActive && (
        <FlatList
          style={styles.list}
          data={domaineResults}
          keyExtractor={(d) => d.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 49 + 16 }]}
          renderItem={({ item, index }) => (
            <DomaineResultRow domaine={item} separateur={index < domaineResults.length - 1} />
          )}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsTxt}>Aucun domaine trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },

  largeTitle: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
    letterSpacing: 0.37,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    paddingHorizontal: 20,
    marginBottom: 4,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: SEARCH_VERTICAL_MARGIN,
  },
  searchInputWrapper: {
    flex: 1,
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: "400",
    paddingVertical: 0,
  },
  cancelBtn: {
    paddingLeft: 8,
    paddingRight: 4,
    height: SEARCH_BAR_HEIGHT,
    justifyContent: "center",
  },
  cancelTxt: {
    fontSize: 17,
    fontWeight: "400",
    color: "#007AFF",
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 13,
  },

  regionRow: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  regionNom: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  regionCount: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    marginRight: 6,
  },
  chevron: { marginLeft: 2 },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

  listContent: { paddingTop: 4 },

  domaineRow: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarWrapper: { marginRight: 12 },
  domaineContent: { flex: 1, justifyContent: "center", marginRight: 8 },
  domaineNom: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  domaineMeta: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 18,
    marginTop: 2,
  },

  noResults: { paddingTop: 80, alignItems: "center" },
  noResultsTxt: { fontSize: 17, fontWeight: "400", color: "#8E8E93" },
});
