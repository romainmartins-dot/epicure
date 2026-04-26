import { Pressable, StyleSheet, Text, View } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { Adresse } from "../../features/adresses/types";
import { typeCouleur, typeEmoji, typeLabel } from "../utils/formatters";

interface Props {
  item: Adresse;
}

export default function AdresseCard({ item }: Props) {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={[styles.emoji, { backgroundColor: typeCouleur(item.type) + "20" }]}>
          <Text style={{ fontSize: 20 }}>{typeEmoji(item.type)}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.ville}>
            {item.adresse ? `${item.adresse}, ` : ""}
            {item.ville}
          </Text>
          {item.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={[styles.badge, { backgroundColor: typeCouleur(item.type) }]}>
          <Text style={styles.badgeTxt}>{typeLabel(item.type)}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  right: { flex: 1 },
  nom: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", marginBottom: 2 },
  ville: { fontSize: 13, color: "#888", marginBottom: 3 },
  desc: { fontSize: 12, color: "#aaa", lineHeight: 17 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
  badgeTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },
});
