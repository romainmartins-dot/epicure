import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useCurateur } from "../hooks/useCurateur";

interface Props {
  curateurId: string;
}

function computeInitiales(nom: string): string {
  return nom
    .split(" ")
    .map((w) => w.replace(/^L[''']/i, ""))
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function InitialesHero({ nom, isDark }: { nom: string; isDark: boolean }) {
  const initiales = computeInitiales(nom);

  return (
    <View style={[styles.initialesHero, { backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7" }]}>
      <Text style={[styles.initialesTxt, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}>
        {initiales}
      </Text>
    </View>
  );
}

export function CurateurProfileScreen({ curateurId }: Props) {
  const { curateur, loading } = useCurateur(curateurId);
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const bodyColor = isDark ? "#EBEBF5" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";
  const labelColor = "#8E8E93";
  const rowPressedBg = isDark ? "#2C2C2E" : "#F2F2F7";

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#C0392B" />
      </View>
    );
  }

  if (!curateur) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={styles.errorTxt}>Profil introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <InitialesHero nom={curateur.nom} isDark={isDark} />

      <View style={styles.identite}>
        <Text style={[styles.nom, { color: titleColor }]}>{curateur.nom}</Text>
        {curateur.cave_id == null ? (
          <Text style={styles.titre}>
            {curateur.titre} · {curateur.ville}
          </Text>
        ) : (
          <>
            <Text style={styles.titre}>{curateur.titre}</Text>
            <Text style={styles.localisation}>{curateur.ville}</Text>
          </>
        )}
      </View>

      <View style={[styles.separator, { backgroundColor: separatorColor }]} />

      {curateur.bio_courte ? (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: labelColor }]}>PORTRAIT</Text>
          <Text style={[styles.bio, { color: bodyColor }]}>{curateur.bio_courte}</Text>
        </View>
      ) : null}

      {curateur.citation_phare ? (
        <>
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <View style={styles.citationWrapper}>
            <Text style={[styles.citation, { color: titleColor }]}>{curateur.citation_phare}</Text>
          </View>
        </>
      ) : null}

      <View style={[styles.separator, { backgroundColor: separatorColor }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: labelColor }]}>RECOMMANDATIONS</Text>
        <Text style={[styles.sectionSub, { color: labelColor }]}>
          Domaines sélectionnés par {curateur.nom}
        </Text>
        {curateur.domaines_recommandes.map((domaineId, i) => (
          <Pressable
            key={domaineId}
            style={({ pressed }) => [
              styles.domaineRow,
              { backgroundColor: pressed ? rowPressedBg : bgColor },
            ]}
            onPress={() => router.push(`/domaine/${domaineId}` as Href)}
          >
            <Text style={[styles.domaineNom, { color: titleColor }]} numberOfLines={1}>
              {domaineId
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </Text>
            <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
            {i < curateur.domaines_recommandes.length - 1 && (
              <View style={[styles.domaineSep, { backgroundColor: separatorColor }]} />
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  initialesHero: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  initialesTxt: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.37,
  },

  identite: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  nom: {
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  titre: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 20,
    marginTop: 4,
  },
  localisation: {
    fontSize: 15,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 20,
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
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    marginBottom: 16,
  },
  bio: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 24,
  },

  citationWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  citation: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    fontStyle: "italic",
  },

  domaineRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  domaineNom: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    marginRight: 8,
  },
  domaineSep: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
  },
});
