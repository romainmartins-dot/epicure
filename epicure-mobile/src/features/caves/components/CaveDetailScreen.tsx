import { ActivityIndicator, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import Animated from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { DomaineAvatar } from "../../domaines/components/DomaineAvatar";
import { Domaine, useVins } from "../../vins";
import { Cave } from "../types";
import { PHOTO_HEIGHT } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

function DomaineRow({ domaine, isLast }: { domaine: Domaine; isLast: boolean }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const pressedBg = isDark ? "#2C2C2E" : "#F2F2F7";
  const nomColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";
  const subtitle = [domaine.vigneron, domaine.village].filter(Boolean).join(" · ");

  return (
    <Pressable
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? pressedBg : bgColor }]}
      onPressIn={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPress={() => router.push(`/domaine/${domaine.id}`)}
    >
      <View style={styles.avatarWrapper}>
        <DomaineAvatar nom={domaine.nom} photoUrl={domaine.photo_url} />
      </View>
      <View style={styles.rowLeft}>
        <Text style={[styles.rowNom, { color: nomColor }]} numberOfLines={1}>
          {domaine.nom}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={styles.rowCount}>{domaine.vins.length}</Text>
      <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
      {!isLast && <View style={[styles.separator, { backgroundColor: separatorColor }]} />}
    </Pressable>
  );
}

interface Props {
  cave: Cave;
  scrollHandler: React.ComponentProps<typeof Animated.ScrollView>["onScroll"];
}

export function CaveDetailScreen({ cave, scrollHandler }: Props) {
  const { domaines, loading: vinsLoading } = useVins(cave.id);
  const isDark = useColorScheme() === "dark";
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const emptyBg = isDark ? "#2C2C2E" : "#F2F2F7";

  return (
    <Animated.ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <View style={styles.spacer} />
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <CaveInfo cave={cave} />

        {!vinsLoading && domaines.length > 0 && <Text style={styles.vinsTitle}>RÉFÉRENCÉS</Text>}
        {vinsLoading && <ActivityIndicator color="#C0392B" style={styles.loader} />}

        {domaines.map((d, i) => (
          <DomaineRow key={d.id} domaine={d} isLast={i === domaines.length - 1} />
        ))}

        {!vinsLoading && domaines.length === 0 && (
          <View style={[styles.empty, { backgroundColor: emptyBg }]}>
            <Text style={styles.emptyTxt}>Aucun vin renseigné</Text>
          </View>
        )}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "transparent" },
  content: { paddingBottom: 80 },
  spacer: { height: PHOTO_HEIGHT },

  card: {},

  vinsTitle: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
  },

  row: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarWrapper: { marginRight: 12 },
  rowLeft: { flex: 1, marginRight: 8 },
  rowNom: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  rowSub: { fontSize: 13, color: "#8E8E93", lineHeight: 18, marginTop: 1 },
  rowCount: { fontSize: 15, color: "#8E8E93", marginRight: 8 },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 0,
    height: 0.5,
  },

  loader: { marginTop: 24 },
  empty: {
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: "center",
  },
  emptyTxt: { fontSize: 15, color: "#AEAEB2" },
});
