import {
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

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { WINE_TYPE_COLORS } from "../../vins/data/wineTypeColors";
import type { Vin } from "../../vins/types";
import { useVinsByDomaine } from "../hooks/useVinsByDomaine";
import type { Domaine } from "../types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * (9 / 16));

// ─── Hero visuel ─────────────────────────────────────────────────────────────

function DomaineHero({ nom, photoUrl }: { nom: string; photoUrl?: string | null }) {
  const isDark = useColorScheme() === "dark";

  if (photoUrl) {
    return (
      <View style={styles.heroWrapper}>
        <Image source={photoUrl} style={styles.heroPhoto} contentFit="cover" cachePolicy="disk" />
      </View>
    );
  }

  const initiales = nom
    .split(" ")
    .map((w) => w.replace(/^L[''']/i, "").replace(/^d[''']/i, ""))
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.placeholder, { backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7" }]}>
      <Text style={[styles.placeholderInitiales, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}>
        {initiales}
      </Text>
    </View>
  );
}

// ─── VinRow ──────────────────────────────────────────────────────────────────

function VinRow({ vin, separateur }: { vin: Vin; separateur: boolean }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const millesimeLabel = vin.millesime
    ? String(vin.millesime)
    : (vin.millesimes_assemblage?.join(" · ") ?? "—");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.vinRow,
        { backgroundColor: pressed ? (isDark ? "#2C2C2E" : "#F2F2F7") : "transparent" },
      ]}
      onPress={() => router.push(`/vin/${vin.id}` as Href)}
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
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
      {separateur && <View style={[styles.vinSeparator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

// ─── SignatureEquipe ──────────────────────────────────────────────────────────

function SignatureEquipe() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <View style={styles.signatureWrapper}>
      <View style={[styles.signatureSep, { backgroundColor: separatorColor }]} />
      <Pressable
        style={({ pressed }) => [styles.signaturePressable, pressed && { opacity: 0.6 }]}
        onPress={() => router.push("/curateur/equipe-epicure" as Href)}
        accessibilityRole="button"
        accessibilityLabel="Profil de L'équipe Epicure"
      >
        <Text style={[styles.signatureNom, { color: nomColor }]}>{"— L'équipe Epicure"}</Text>
        <Text style={styles.signatureSousTitre}>Fondateur · Lille</Text>
      </Pressable>
    </View>
  );
}

// ─── DomaineProfileScreen ────────────────────────────────────────────────────

interface Props {
  domaineId: string;
  domaine: Domaine | null;
}

function DomaineMinimal() {
  const isDark = useColorScheme() === "dark";
  const labelColor = "#8E8E93";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <>
      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      <View style={styles.selectionSection}>
        <Text style={[styles.selectionLabel, { color: labelColor }]}>
          {"SÉLECTION DE L’ÉQUIPE EPICURE"}
        </Text>
        <Text style={styles.selectionCitation}>
          {
            "Sélectionné pour la rigueur de son travail vivant et l’expression honnête de son terroir."
          }
        </Text>
      </View>
      <SignatureEquipe />
    </>
  );
}

function DomaineComplet({ domaine, vins }: { domaine: Domaine; vins: Vin[] }) {
  const isDark = useColorScheme() === "dark";
  const labelColor = "#8E8E93";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <>
      {domaine.philosophie ? (
        <View style={styles.section}>
          <Text style={[styles.descriptionText, { color: titleColor }]}>{domaine.philosophie}</Text>
        </View>
      ) : null}

      {vins.length > 0 && (
        <>
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: labelColor }]}>VINS DISPONIBLES</Text>
            {vins.map((vin, i) => (
              <VinRow key={vin.id} vin={vin} separateur={i < vins.length - 1} />
            ))}
          </View>
        </>
      )}

      <SignatureEquipe />
    </>
  );
}

export function DomaineProfileScreen({ domaineId, domaine }: Props) {
  const { vins } = useVinsByDomaine(domaineId);
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";

  if (!domaine) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={{ color: "#8E8E93", fontSize: 15 }}>Domaine introuvable</Text>
      </View>
    );
  }

  const sousTitre = [domaine.vigneron, domaine.village].filter(Boolean).join(" · ");
  const footnote = [domaine.appellation_principale, domaine.region].filter(Boolean).join(" · ");
  const isComplet = domaine.statut_donnees === "complet";
  const hasPhoto = !!domaine.photo_url;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Pressable
        style={[styles.backBtn, { top: insets.top + 12 }, hasPhoto && styles.backBtnOnPhoto]}
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={hasPhoto ? "#FFFFFF" : isDark ? "#FFFFFF" : "#1C1C1E"}
        />
      </Pressable>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, !hasPhoto && { paddingTop: insets.top + 60 }]}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <DomaineHero nom={domaine.nom} photoUrl={domaine.photo_url} />

        <View style={styles.identite}>
          <Text style={[styles.largeTitre, { color: titleColor }]}>{domaine.nom}</Text>
          {sousTitre ? <Text style={styles.sousTitre}>{sousTitre}</Text> : null}
          {footnote ? <Text style={styles.footnote}>{footnote}</Text> : null}
        </View>

        {isComplet ? <DomaineComplet domaine={domaine} vins={vins} /> : <DomaineMinimal />}
      </ScrollView>
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 48 },

  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  backBtnOnPhoto: {
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  heroWrapper: { width, height: HERO_HEIGHT },
  heroPhoto: { width, height: HERO_HEIGHT },

  placeholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderInitiales: {
    fontSize: 64,
    fontWeight: "700",
    letterSpacing: 0.37,
  },

  identite: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  largeTitre: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  sousTitre: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 20,
    marginTop: 4,
  },
  footnote: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 18,
    marginTop: 2,
  },

  separator: {
    height: 0.5,
    marginHorizontal: 20,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 13,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 24,
  },

  selectionSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  selectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 13,
    marginBottom: 16,
  },
  selectionCitation: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    color: "#1C1C1E",
    fontStyle: "italic",
  },

  vinRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  vinInfo: { flex: 1, justifyContent: "center", marginRight: 8 },
  vinCuvee: { fontSize: 15, fontWeight: "600", lineHeight: 20 },
  vinAppellation: { fontSize: 13, fontWeight: "400", color: "#8E8E93", lineHeight: 18 },
  vinMillesime: { fontSize: 15, fontWeight: "400", color: "#8E8E93", marginRight: 6 },
  vinSeparator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 0,
    height: 0.5,
  },

  signatureWrapper: {
    marginTop: 24,
    marginBottom: 16,
  },
  signatureSep: {
    height: 0.5,
    marginHorizontal: 20,
  },
  signaturePressable: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
    alignItems: "flex-end",
  },
  signatureNom: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  signatureSousTitre: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 18,
    marginTop: 2,
  },
});
