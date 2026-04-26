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

function InfoSection({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
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
          <Ionicons name="wine" size={48} color="#C7C7CC" />
        </View>
      )}

      <View style={styles.body}>
        <View style={[styles.badge, { backgroundColor: typeColor + "1F" }]}>
          <Text style={[styles.badgeText, { color: typeColor }]}>{vin.type.toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>{vin.cuvee}</Text>
        <Text style={styles.subtitle}>
          {vin.appellation} · {millesimeLabel}
        </Text>

        {domaine && (
          <Text style={styles.domaineLine}>
            {domaine.nom} — {domaine.vigneron} · {domaine.village}
          </Text>
        )}

        <View style={styles.separator} />

        <Text style={styles.descriptionCourte}>{vin.description_courte}</Text>

        <View style={styles.separator} />

        <Text style={styles.descriptionLongue}>{vin.description_longue}</Text>

        <View style={styles.separator} />

        <InfoSection label="CÉPAGE" value={vin.cepage} />
        <InfoSection label="TERROIR" value={vin.terroir} />
        <InfoSection label="ÉLEVAGE" value={vin.elevage} />
        <InfoSection label="ACCORDS" value={vin.accords_mets.join(", ")} />
        <InfoSection
          label="SERVICE"
          value={`${vin.service_temperature_c} · Garde ${vin.potentiel_garde}`}
        />
        {vin.so2 ? <InfoSection label="SO₂" value={vin.so2} /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  errorTxt: { fontSize: 15, color: "#777" },

  hero: {
    width,
    height: HERO_HEIGHT,
  },
  heroPlaceholder: {
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },

  body: { paddingHorizontal: 20, paddingTop: 20 },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: 0.37,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: "#8E8E93",
    marginTop: 4,
  },
  domaineLine: {
    fontSize: 16,
    lineHeight: 21,
    color: "#3C3C43",
    marginTop: 8,
  },

  separator: {
    height: 0.5,
    backgroundColor: "#C6C6C8",
    marginLeft: 0,
    marginVertical: 20,
  },

  descriptionCourte: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  descriptionLongue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "400",
    color: "#1C1C1E",
  },

  infoSection: { marginBottom: 16 },
  infoLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "400",
    color: "#1C1C1E",
  },
});
