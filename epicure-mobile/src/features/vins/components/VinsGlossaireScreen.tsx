import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SectionList,
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

import { VinFlat, VinSection, useAllVins } from "../hooks/useAllVins";

// ─── constants ───────────────────────────────────────────────────────────────

const ROW_HEIGHT = 64;
const SEARCH_BAR_HEIGHT = 36;
const SEARCH_VERTICAL_MARGIN = 8;
const SEARCH_BLOCK_HEIGHT = SEARCH_BAR_HEIGHT + SEARCH_VERTICAL_MARGIN * 2;

function normaliserRecherche(s: string): string {
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

  const cancelWidth = cancelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72],
  });
  const cancelOpacity = cancelAnim;

  const inputBg = isDark ? "#3A3A3C" : "#E3E3E8";
  const inputColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const placeholderColor = "#8E8E93";

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchInputWrapper, { backgroundColor: inputBg }]}>
        <Ionicons name="search" size={14} color={placeholderColor} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: inputColor }]}
          value={query}
          onChangeText={onQueryChange}
          onFocus={onFocus}
          placeholder="Rechercher"
          placeholderTextColor={placeholderColor}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <Animated.View style={{ width: cancelWidth, opacity: cancelOpacity, overflow: "hidden" }}>
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
  const metaColor = "#8E8E93";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? (isDark ? "#2C2C2E" : "#F2F2F7") : bgColor },
      ]}
      onPressIn={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPress={() => router.push(`/vin/${vin.id}` as Href)}
    >
      <View style={styles.rowContent}>
        <Text style={[styles.cuvee, { color: nomColor }]} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={[styles.meta, { color: metaColor }]} numberOfLines={1}>
          {vin.appellation} · {vin.domaine_nom}
        </Text>
      </View>
      <Text style={[styles.millesime, { color: metaColor }]}>{vin.millesime ?? "Assemblage"}</Text>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" style={styles.chevron} />
      {separateur && <View style={[styles.rowSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────

function SectionHeader({ lettre }: { lettre: string }) {
  const isDark = useColorScheme() === "dark";
  if (!lettre) return null;
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  return (
    <View style={[styles.sectionHeader, { backgroundColor: bgColor }]}>
      <Text style={styles.sectionLettre}>{lettre}</Text>
    </View>
  );
}

// ─── VinsGlossaireScreen ─────────────────────────────────────────────────────

export function VinsGlossaireScreen() {
  const { sections, total } = useAllVins();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchInputRef = useRef<TextInput>(null);
  const listRef = useRef<SectionList<VinFlat, VinSection>>(null);

  // Masquer la search bar au premier rendu (contentOffset seul ne suffit pas)
  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      const scrollView = listRef.current?.getScrollResponder();
      (scrollView as any)?.scrollTo({ y: SEARCH_BLOCK_HEIGHT, animated: false });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const metaColor = "#8E8E93";

  const isSearching = query.trim().length > 0;

  // ── filtered sections ────────────────────────────────────────────────────
  const displaySections = useMemo<VinSection[]>(() => {
    if (!isSearching) return sections;
    const q = normaliserRecherche(query.trim());
    const allVins = sections.flatMap((s) => s.data);
    const matching = allVins.filter(
      (vin) =>
        normaliserRecherche(vin.cuvee).includes(q) ||
        normaliserRecherche(vin.appellation).includes(q) ||
        normaliserRecherche(vin.domaine_nom).includes(q) ||
        (vin.region ? normaliserRecherche(vin.region).includes(q) : false) ||
        (vin.vigneron_nom ? normaliserRecherche(vin.vigneron_nom).includes(q) : false),
    );
    if (matching.length === 0) return [];
    return [{ lettre: "", data: matching }];
  }, [query, sections, isSearching]);

  const noResults = isSearching && displaySections.length === 0;

  // Scroll to top when entering search mode
  useEffect(() => {
    if (isSearching) {
      listRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: SEARCH_BLOCK_HEIGHT,
        animated: false,
      });
    }
  }, [isSearching]);

  const handleCancel = useCallback(() => {
    setQuery("");
    setIsFocused(false);
    searchInputRef.current?.blur();
  }, []);

  const scrollToLettre = useCallback(
    (lettre: string) => {
      const sectionIndex = sections.findIndex((s) => s.lettre === lettre);
      if (sectionIndex < 0) return;
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        viewOffset: 0,
        animated: false,
      });
    },
    [sections],
  );

  const lettres = sections.map((s) => s.lettre);

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SectionList
        ref={listRef}
        sections={noResults ? [{ lettre: "", data: [] as VinFlat[] }] : displaySections}
        keyExtractor={(vin) => vin.id}
        stickySectionHeadersEnabled={!isSearching}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentOffset={{ x: 0, y: SEARCH_BLOCK_HEIGHT }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 49 + 16 }}
        ListHeaderComponent={
          <View style={{ backgroundColor: bgColor }}>
            {/* Search bar — hidden by contentOffset initially */}
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              isFocused={isFocused}
              onFocus={() => setIsFocused(true)}
              onCancel={handleCancel}
              inputRef={searchInputRef}
            />
            {/* Page header */}
            <View style={[styles.pageHeader, { paddingTop: insets.top + 16 }]}>
              <Text style={[styles.titre, { color: titleColor }]}>Tous les vins</Text>
              <Text style={[styles.sousTitre, { color: metaColor }]}>
                {total} cuvée{total > 1 ? "s" : ""} référencée{total > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => <SectionHeader lettre={section.lettre} />}
        renderItem={({ item, index, section }) => (
          <VinRow vin={item} separateur={index < section.data.length - 1} />
        )}
        ListEmptyComponent={
          noResults ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTxt, { color: metaColor }]}>Aucun résultat</Text>
            </View>
          ) : null
        }
        onScrollToIndexFailed={() => {}}
      />

      {/* Ancres A-Z — masquées pendant la recherche */}
      {!isSearching && (
        <View
          style={[styles.ancresWrapper, { top: insets.top + 16, bottom: insets.bottom + 49 + 16 }]}
          pointerEvents="box-none"
        >
          <View style={styles.ancresContainer}>
            {lettres.map((lettre) => (
              <Pressable
                key={lettre}
                style={({ pressed }) => [styles.ancreBtn, pressed && styles.ancreBtnPressed]}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  scrollToLettre(lettre);
                }}
              >
                <Text style={styles.ancreTxt}>{lettre}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Search bar
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
  searchIcon: {
    marginRight: 6,
  },
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

  // Page header
  pageHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  titre: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.37,
    lineHeight: 41,
  },
  sousTitre: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 4,
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionLettre: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#8E8E93",
  },

  // Rows
  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rowContent: {
    flex: 1,
    marginRight: 8,
    justifyContent: "center",
  },
  cuvee: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  meta: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    marginTop: 2,
  },
  millesime: {
    fontSize: 15,
    fontWeight: "400",
    marginRight: 6,
  },
  chevron: {
    marginLeft: 2,
  },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

  // Empty state
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyTxt: {
    fontSize: 17,
    fontWeight: "400",
  },

  // Anchors
  ancresWrapper: {
    position: "absolute",
    right: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  ancresContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: "center",
    gap: 1,
  },
  ancreBtn: {
    width: 20,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  ancreBtnPressed: { opacity: 0.4 },
  ancreTxt: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    lineHeight: 13,
  },
});
