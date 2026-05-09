import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { WINE_TYPE_COLORS } from "../data/wineTypeColors";
import { Domaine, Vin } from "../types";

function VinRow({ vin }: { vin: Vin }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const pressedBg = isDark ? "#2C2C2E" : "#F9F9F9";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";
  const millesimeLabel = vin.millesime
    ? String(vin.millesime)
    : (vin.millesimes_assemblage?.join(" · ") ?? "—");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.vinRow,
        { borderTopColor: separatorColor, backgroundColor: pressed ? pressedBg : "transparent" },
      ]}
      onPress={() => router.push(`/vin/${vin.id}`)}
    >
      <View style={[styles.dot, { backgroundColor: WINE_TYPE_COLORS[vin.type] ?? "#C7C7CC" }]} />
      <View style={styles.vinInfo}>
        <Text style={[styles.vinCuvee, { color: nomColor }]} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={styles.vinAppellation} numberOfLines={1}>
          {vin.appellation}
        </Text>
      </View>
      <Text style={styles.vinMillesime}>{millesimeLabel}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

interface Props {
  domaine: Domaine | null;
  loading: boolean;
}

export function DomaineDetailScreen({ domaine, loading }: Props) {
  const isDark = useColorScheme() === "dark";
  const scrollBg = isDark ? "#000000" : "#E5E5EA";
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const bodyColor = isDark ? "#EBEBF5" : "#3C3C43";
  const secondaryBg = isDark ? "#2C2C2E" : "#F2F2F7";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: cardBg }]}>
        <ActivityIndicator size="large" color="#C0392B" />
      </View>
    );
  }

  if (!domaine) {
    return (
      <View style={[styles.centered, { backgroundColor: cardBg }]}>
        <Text style={styles.errorTxt}>Domaine introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: scrollBg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces
    >
      {domaine.photo_url ? (
        <Image
          source={domaine.photo_url}
          style={styles.hero}
          contentFit="cover"
          cachePolicy="disk"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder, { backgroundColor: secondaryBg }]}>
          <Ionicons name="leaf" size={64} color="#C7C7CC" />
        </View>
      )}

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.pullIndicator} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>DOMAINE</Text>
        </View>

        <Text style={[styles.nom, { color: titleColor }]}>{domaine.nom}</Text>
        <Text style={[styles.meta, { color: bodyColor }]}>
          {domaine.vigneron} · {domaine.village}
        </Text>
        <Text style={styles.appellation}>
          {domaine.appellation_principale} · {domaine.region}
        </Text>

        {domaine.anciennete_bio && (
          <View style={styles.bioBadge}>
            <Ionicons name="leaf-outline" size={12} color="#27AE60" />
            <Text style={styles.bioBadgeText}>{domaine.anciennete_bio}</Text>
          </View>
        )}

        {domaine.histoire && (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <Text style={[styles.histoire, { color: bodyColor }]}>{domaine.histoire}</Text>
          </>
        )}

        {domaine.philosophie && (
          <View style={styles.philosophieBlock}>
            <View style={styles.philosophieAccent} />
            <Text style={[styles.philosophie, { color: bodyColor }]}>{domaine.philosophie}</Text>
          </View>
        )}

        {domaine.vins.length > 0 && (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <Text style={styles.vinsTitle}>CUVÉES</Text>
            {domaine.vins.map((v) => (
              <VinRow key={v.id} vin={v} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const HERO_HEIGHT = 280;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  hero: { width: "100%", height: HERO_HEIGHT },
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

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#C0392B18",
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#C0392B",
    textTransform: "uppercase",
  },

  nom: { fontSize: 28, fontWeight: "700", letterSpacing: 0.2 },
  meta: { fontSize: 15, marginTop: 4 },
  appellation: { fontSize: 13, color: "#8E8E93", marginTop: 2 },

  bioBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#27AE6012",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bioBadgeText: { fontSize: 12, color: "#27AE60", fontWeight: "500" },

  separator: { height: 0.5, marginVertical: 24 },

  histoire: { fontSize: 15, lineHeight: 23, marginBottom: 16 },

  philosophieBlock: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  philosophieAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: "#C0392B",
    flexShrink: 0,
  },
  philosophie: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
  },

  vinsTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  vinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  vinInfo: { flex: 1 },
  vinCuvee: { fontSize: 15, fontWeight: "600" },
  vinAppellation: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  vinMillesime: { fontSize: 13, color: "#C7C7CC" },
  chevron: { fontSize: 18, color: "#C7C7CC", lineHeight: 22 },
});
