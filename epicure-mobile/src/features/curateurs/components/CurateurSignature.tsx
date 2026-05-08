import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useRouter } from "expo-router";
import type { Href } from "expo-router";

import { getCurateurByCaveId } from "../api/curateursApi";

interface Props {
  caveId: number;
  caveNom?: string;
}

export function CurateurSignature({ caveId, caveNom }: Props) {
  const curateur = getCurateurByCaveId(caveId);
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  if (!curateur) return null;

  const separatorColor = isDark ? "#38383A" : "#C6C6C8";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const sousTitre = caveNom
    ? `${curateur.titre}, ${caveNom} — ${curateur.ville}`
    : `${curateur.titre} — ${curateur.ville}`;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      <Pressable
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
        onPress={() => router.push(`/curateur/${curateur.id}` as Href)}
        accessibilityLabel={`Profil de ${curateur.nom}`}
        accessibilityRole="button"
      >
        <Text style={[styles.nom, { color: nomColor }]}>— {curateur.nom}</Text>
        <Text style={styles.sousTitre}>{sousTitre}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    marginBottom: 16,
  },
  separator: {
    height: 0.5,
    marginHorizontal: 20,
  },
  pressable: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
    alignItems: "flex-end",
  },
  pressed: { opacity: 0.6 },
  nom: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  sousTitre: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    lineHeight: 18,
    marginTop: 2,
  },
});
