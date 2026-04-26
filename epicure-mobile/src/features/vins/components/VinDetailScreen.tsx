import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

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
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionValue}>{value}</Text>
    </View>
  );
}

interface Props {
  vin: Vin | null;
  domaine: Domaine | null;
  loading: boolean;
}

export function VinDetailScreen({ vin, domaine, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C0392B" />
      </View>
    );
  }

  if (!vin) {
    return (
      <View style={styles.centered}>
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
      style={styles.scroll}
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
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <Ionicons name="wine" size={64} color="#C7C7CC" />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.pullIndicator} />

        {/* Badges type + alcool */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: typeColor + "18" }]}>
            <Text style={[styles.badgeText, { color: typeColor }]}>{vin.type.toUpperCase()}</Text>
          </View>
          <View style={styles.badgeAlcool}>
            <Text style={styles.badgeAlcoolText}>{vin.alcool_pct}% vol.</Text>
          </View>
        </View>

        {/* Titre + subtitle */}
        <Text style={styles.title}>{vin.cuvee}</Text>
        <Text style={styles.subtitle}>
          {vin.appellation} · {millesimeLabel}
        </Text>

        {/* Domaine row */}
        {domaine && (
          <View style={styles.domaineRow}>
            <View style={styles.domaineIcon}>
              <Ionicons name="location" size={14} color="#8E8E93" />
            </View>
            <View style={styles.domaineInfo}>
              <Text style={styles.domaineNom}>{domaine.nom}</Text>
              <Text style={styles.domaineVigneron}>
                {domaine.vigneron} · {domaine.village}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </View>
        )}

        <View style={styles.separator} />

        {/* Pull quote + description */}
        <Text style={styles.pullQuote}>{vin.description_courte}</Text>
        <Text style={styles.body}>{vin.description_longue}</Text>

        {vin.note_curateur && domaine?.curateur_nom && (
          <>
            <View style={styles.separator} />
            <View style={styles.curateurBlock}>
              <View style={styles.curateurAccent} />
              <View style={styles.curateurBody}>
                <Text style={styles.curateurNom}>{domaine.curateur_nom.toUpperCase()}</Text>
                <Text style={styles.curateurNote}>{vin.note_curateur}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.separator} />

        {/* Grille 2×2 */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>CÉPAGE</Text>
            <Text style={styles.metaValue}>{vin.cepage}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>MILLÉSIME</Text>
            <Text style={styles.metaValue}>{millesimeLabel}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>ÉLEVAGE</Text>
            <Text style={styles.metaValue}>{vin.elevage}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>TERROIR</Text>
            <Text style={styles.metaValue}>{vin.terroir}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Accords — une ligne par accord */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>ACCORDS</Text>
          {vin.accords_mets.map((accord, i) => (
            <View key={i} style={styles.accordRow}>
              <View style={styles.accordDot} />
              <Text style={styles.sectionValue}>{accord}</Text>
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
  scroll: { flex: 1, backgroundColor: "#E5E5EA" },
  scrollContent: { paddingBottom: 80 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  hero: { width, height: HERO_HEIGHT },
  heroPlaceholder: {
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginTop: -24,
    backgroundColor: "#fff",
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
    backgroundColor: "#F2F2F7",
  },
  badgeAlcoolText: { fontSize: 11, fontWeight: "500", color: "#8E8E93", letterSpacing: 0.3 },

  title: { fontSize: 34, lineHeight: 41, fontWeight: "700", color: "#1C1C1E", letterSpacing: 0.37 },
  subtitle: { fontSize: 15, lineHeight: 20, color: "#8E8E93", marginTop: 4, marginBottom: 16 },

  domaineRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  domaineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  domaineInfo: { flex: 1 },
  domaineNom: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  domaineVigneron: { fontSize: 13, color: "#8E8E93", marginTop: 1 },

  separator: { height: 0.5, backgroundColor: "#C6C6C8", marginVertical: 24 },

  pullQuote: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 10,
  },
  body: { fontSize: 15, lineHeight: 22, color: "#3C3C43" },

  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metaCell: {
    width: (width - 40 - 12) / 2,
    backgroundColor: "#F2F2F7",
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
  metaValue: { fontSize: 15, fontWeight: "500", color: "#1C1C1E", lineHeight: 20 },

  sectionBlock: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionValue: { fontSize: 15, lineHeight: 22, color: "#3C3C43" },

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
    color: "#3C3C43",
    fontStyle: "italic",
  },
});
