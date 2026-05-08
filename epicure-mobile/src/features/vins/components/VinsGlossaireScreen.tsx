import { useCallback, useRef } from "react";
import { Pressable, SectionList, StyleSheet, Text, View, useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { VinFlat, VinSection, useAllVins } from "../hooks/useAllVins";

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
      {separateur && <View style={[styles.separator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

function SectionHeader({ lettre }: { lettre: string }) {
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";

  return (
    <View style={[styles.sectionHeader, { backgroundColor: bgColor }]}>
      <Text style={styles.sectionLettre}>{lettre}</Text>
    </View>
  );
}

export function VinsGlossaireScreen() {
  const { sections, total } = useAllVins();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const listRef = useRef<SectionList<VinFlat, VinSection>>(null);

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const metaColor = "#8E8E93";

  const lettres = sections.map((s) => s.lettre);

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

  if (total === 0) {
    return (
      <View style={[styles.vide, { backgroundColor: bgColor, paddingTop: insets.top }]}>
        <Text style={styles.videTxt}>Aucun vin référencé pour le moment</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SectionList
        ref={listRef}
        sections={sections}
        keyExtractor={(vin) => vin.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 49 + 16 }}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <Text style={[styles.titre, { color: titleColor }]}>Tous les vins</Text>
            <Text style={[styles.sousTitre, { color: metaColor }]}>
              {total} cuvée{total > 1 ? "s" : ""} référencée{total > 1 ? "s" : ""}
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => <SectionHeader lettre={section.lettre} />}
        renderItem={({ item, index, section }) => (
          <VinRow vin={item} separateur={index < section.data.length - 1} />
        )}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        onScrollToIndexFailed={() => {}}
      />

      {/* Ancres latérales A-Z */}
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
    </View>
  );
}

const ROW_HEIGHT = 64;

const styles = StyleSheet.create({
  container: { flex: 1 },

  vide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videTxt: {
    fontSize: 17,
    fontWeight: "400",
    color: "#8E8E93",
    textAlign: "center",
    paddingHorizontal: 32,
  },

  header: {
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
  separator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

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
  ancreBtnPressed: {
    opacity: 0.4,
  },
  ancreTxt: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    lineHeight: 13,
  },
});
