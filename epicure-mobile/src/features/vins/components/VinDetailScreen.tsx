import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Domaine, Vin } from "../types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * (3 / 4));

const TYPE_COLORS: Record<string, string> = {
  blanc: "#F0A500",
  rouge: "#C0392B",
  rose: "#E07080",
  petillant: "#5B9BD5",
  doux: "#8E44AD",
};

function SectionBlock({ label, value }: { label: string; value: string }) {
  const isDark = useColorScheme() === "dark";
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={[styles.sectionValue, { color: isDark ? "#EBEBF5" : "#3C3C43" }]}>{value}</Text>
    </View>
  );
}

interface Props {
  vin: Vin | null;
  domaine: Domaine | null;
  loading: boolean;
}

export function VinDetailScreen({ vin, domaine, loading }: Props) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const scrollBg = isDark ? "#000000" : "#E5E5EA";
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const bodyColor = isDark ? "#EBEBF5" : "#3C3C43";
  const secondaryBg = isDark ? "#2C2C2E" : "#F2F2F7";
  const tertiaryBg = isDark ? "#3A3A3C" : "#E5E5EA";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: cardBg }]}>
        <ActivityIndicator size="large" color="#C0392B" />
      </View>
    );
  }

  if (!vin) {
    return (
      <View style={[styles.centered, { backgroundColor: cardBg }]}>
        <Text style={styles.errorTxt}>Vin introuvable</Text>
      </View>
    );
  }

  const typeColor = TYPE_COLORS[vin.type] ?? "#999";
  const millesimeLabel = vin.millesime
    ? String(vin.millesime)
    : (vin.millesimes_assemblage?.join(" · ") ?? "—");

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: scrollBg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {domaine?.photo_url ? (
        <Image
          source={domaine.photo_url}
          style={styles.hero}
          contentFit="cover"
          cachePolicy="disk"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder, { backgroundColor: secondaryBg }]}>
          <Ionicons name="wine" size={64} color="#C7C7CC" />
        </View>
      )}

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.pullIndicator} />

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: typeColor + "18" }]}>
            <Text style={[styles.badgeText, { color: typeColor }]}>{vin.type.toUpperCase()}</Text>
          </View>
          <View style={[styles.badgeAlcool, { backgroundColor: secondaryBg }]}>
            <Text style={styles.badgeAlcoolText}>{vin.alcool_pct}% vol.</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: titleColor }]}>{vin.cuvee}</Text>
        <Text style={styles.subtitle}>
          {vin.appellation} · {millesimeLabel}
        </Text>

        {domaine && (
          <Pressable
            style={({ pressed }) => [
              styles.domaineRow,
              { backgroundColor: pressed ? tertiaryBg : secondaryBg },
            ]}
            onPress={() => router.push(`/domaine/${domaine.id}` as Href)}
          >
            <View style={[styles.domaineIcon, { backgroundColor: tertiaryBg }]}>
              <Ionicons name="location" size={14} color="#8E8E93" />
            </View>
            <View style={styles.domaineInfo}>
              <Text style={[styles.domaineNom, { color: titleColor }]}>{domaine.nom}</Text>
              <Text style={styles.domaineVigneron}>
                {[domaine.vigneron, domaine.village].filter(Boolean).join(" · ")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </Pressable>
        )}

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        <Text style={[styles.pullQuote, { color: titleColor }]}>{vin.description_courte}</Text>
        <Text style={[styles.body, { color: bodyColor }]}>{vin.description_longue}</Text>

        {vin.note_curateur && domaine?.curateur_nom && (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <View style={styles.curateurBlock}>
              <View style={styles.curateurAccent} />
              <View style={styles.curateurBody}>
                <Text style={styles.curateurNom}>{domaine.curateur_nom.toUpperCase()}</Text>
                <Text style={[styles.curateurNote, { color: bodyColor }]}>{vin.note_curateur}</Text>
              </View>
            </View>
          </>
        )}

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        <View style={styles.metaGrid}>
          <View style={[styles.metaCell, { backgroundColor: secondaryBg }]}>
            <Text style={styles.metaLabel}>CÉPAGE</Text>
            <Text style={[styles.metaValue, { color: titleColor }]}>{vin.cepage}</Text>
          </View>
          <View style={[styles.metaCell, { backgroundColor: secondaryBg }]}>
            <Text style={styles.metaLabel}>MILLÉSIME</Text>
            <Text style={[styles.metaValue, { color: titleColor }]}>{millesimeLabel}</Text>
          </View>
          <View style={[styles.metaCell, { backgroundColor: secondaryBg }]}>
            <Text style={styles.metaLabel}>ÉLEVAGE</Text>
            <Text style={[styles.metaValue, { color: titleColor }]}>{vin.elevage}</Text>
          </View>
          <View style={[styles.metaCell, { backgroundColor: secondaryBg }]}>
            <Text style={styles.metaLabel}>TERROIR</Text>
            <Text style={[styles.metaValue, { color: titleColor }]}>{vin.terroir}</Text>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: separatorColor }]} />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>ACCORDS</Text>
          {(vin.accords_mets ?? []).map((accord, i) => (
            <View key={i} style={styles.accordRow}>
              <View style={styles.accordDot} />
              <Text style={[styles.sectionValue, { color: bodyColor }]}>{accord}</Text>
            </View>
          ))}
        </View>

        <SectionBlock
          label="SERVICE"
          value={`Servir entre ${vin.service_temperature_c} — Garde ${vin.potentiel_garde}`}
        />
        {vin.so2 ? <SectionBlock label="SO₂ TOTAL" value={vin.so2} /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  hero: { width, height: HERO_HEIGHT },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },

  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  badgeAlcool: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAlcoolText: { fontSize: 11, fontWeight: "500", color: "#8E8E93", letterSpacing: 0.3 },

  title: { fontSize: 34, lineHeight: 41, fontWeight: "700", letterSpacing: 0.37 },
  subtitle: { fontSize: 15, lineHeight: 20, color: "#8E8E93", marginTop: 4, marginBottom: 16 },

  domaineRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  domaineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  domaineInfo: { flex: 1 },
  domaineNom: { fontSize: 15, fontWeight: "600" },
  domaineVigneron: { fontSize: 13, color: "#8E8E93", marginTop: 1 },

  separator: { height: 0.5, marginVertical: 24 },

  pullQuote: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  body: { fontSize: 15, lineHeight: 22 },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaCell: {
    width: (width - 40 - 12) / 2,
    borderRadius: 12,
    padding: 14,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  metaValue: { fontSize: 15, fontWeight: "500", lineHeight: 20 },

  sectionBlock: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionValue: { fontSize: 15, lineHeight: 22 },

  accordRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  accordDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#C7C7CC",
    marginTop: 8,
    flexShrink: 0,
  },

  curateurBlock: { flexDirection: "row", gap: 14 },
  curateurAccent: { width: 3, borderRadius: 2, backgroundColor: "#C0392B", flexShrink: 0 },
  curateurBody: { flex: 1 },
  curateurNom: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C0392B",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  curateurNote: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
});
