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

import { VinFlat, useAllVins } from "../hooks/useAllVins";

// ─── constants ───────────────────────────────────────────────────────────────

const ROW_HEIGHT = 64;
const SEARCH_BAR_HEIGHT = 36;
const SEARCH_VERTICAL_MARGIN = 10;

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
          placeholder="Rechercher un vin, un domaine, une appellation"
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

// ─── VinRow ──────────────────────────────────────────────────────────────────

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

// ─── VinsSearchScreen ────────────────────────────────────────────────────────

export function VinsSearchScreen() {
  const { vins, total } = useAllVins();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";

  const isActive = query.trim().length > 0;

  const results = isActive
    ? (() => {
        const q = normaliser(query.trim());
        return vins.filter(
          (v) =>
            normaliser(v.cuvee).includes(q) ||
            normaliser(v.appellation).includes(q) ||
            normaliser(v.domaine_nom).includes(q) ||
            (v.region ? normaliser(v.region).includes(q) : false) ||
            (v.vigneron_nom ? normaliser(v.vigneron_nom).includes(q) : false),
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
      {/* Search bar */}
      <View style={{ paddingTop: insets.top + 16 }}>
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onCancel={handleCancel}
          inputRef={inputRef}
        />
      </View>

      {/* État initial — invitation */}
      {!isActive && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: titleColor }]}>{total} vins curatés</Text>
          <Text style={styles.emptySubtitle}>
            Recherche par cuvée, domaine, région ou appellation
          </Text>
        </View>
      )}

      {/* Résultats */}
      {isActive && (
        <FlatList
          data={results}
          keyExtractor={(v) => v.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 49 + 16 }]}
          renderItem={({ item, index }) => (
            <VinRow vin={item} separateur={index < results.length - 1} />
          )}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsTxt}>Aucun vin trouvé</Text>
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

  listContent: { paddingTop: 4 },

  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rowContent: { flex: 1, marginRight: 8, justifyContent: "center" },
  cuvee: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  meta: { fontSize: 13, fontWeight: "400", color: "#8E8E93", lineHeight: 18, marginTop: 2 },
  millesime: { fontSize: 15, fontWeight: "400", color: "#8E8E93", marginRight: 6 },
  chevron: { marginLeft: 2 },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

  noResults: { paddingTop: 80, alignItems: "center" },
  noResultsTxt: { fontSize: 17, fontWeight: "400", color: "#8E8E93" },
});
