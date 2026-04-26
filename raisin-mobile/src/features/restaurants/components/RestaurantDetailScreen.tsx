import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { Ionicons } from "@expo/vector-icons";

import { Adresse } from "../../adresses/types";
import { CartePlat, CarteSectionType, RestaurantPoc } from "../types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * (3 / 4));

const SECTION_LABELS: Record<CarteSectionType, string> = {
  entree: "ENTRÉES",
  plat: "PLATS",
  dessert: "DESSERTS",
};

const SECTIONS: CarteSectionType[] = ["entree", "plat", "dessert"];

function PlatRow({ plat }: { plat: CartePlat }) {
  return (
    <View style={styles.platRow}>
      <View style={styles.platInfo}>
        <Text style={styles.platNom}>{plat.nom}</Text>
        <Text style={styles.platDescription} numberOfLines={2}>
          {plat.description}
        </Text>
      </View>
      <Text style={styles.platPrix}>{plat.prix}€</Text>
    </View>
  );
}

interface Props {
  adresse: Adresse | null;
  restaurant: RestaurantPoc | null;
  loading: boolean;
}

export function RestaurantDetailScreen({ adresse, restaurant, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (!adresse) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTxt}>Adresse introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {restaurant?.photo_url ? (
        <Image
          source={restaurant.photo_url}
          style={styles.hero}
          contentFit="cover"
          cachePolicy="disk"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <Ionicons name="restaurant" size={64} color="#C7C7CC" />
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.pullIndicator} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>RESTAURANT</Text>
        </View>

        <Text style={styles.title}>{adresse.nom}</Text>
        <Text style={styles.subtitle}>
          {adresse.adresse ? `${adresse.adresse}, ` : ""}
          {adresse.ville}
        </Text>

        {adresse.description ? <Text style={styles.description}>{adresse.description}</Text> : null}

        {restaurant?.carte?.length ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.carteTitle}>Carte</Text>
            <Text style={styles.carteSubtitle}>Cuisine de marché · saison en cours</Text>

            {SECTIONS.map((section) => {
              const plats = restaurant.carte.filter((p) => p.section === section);
              if (!plats.length) return null;
              return (
                <View key={section} style={styles.section}>
                  <Text style={styles.sectionLabel}>{SECTION_LABELS[section]}</Text>
                  {plats.map((plat, i) => (
                    <PlatRow key={i} plat={plat} />
                  ))}
                </View>
              );
            })}
          </>
        ) : null}
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

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#27AE6018",
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#27AE60",
    textTransform: "uppercase",
  },

  title: { fontSize: 34, lineHeight: 41, fontWeight: "700", color: "#1C1C1E", letterSpacing: 0.37 },
  subtitle: { fontSize: 15, lineHeight: 20, color: "#8E8E93", marginTop: 4 },
  description: { fontSize: 15, lineHeight: 22, color: "#3C3C43", marginTop: 12 },

  separator: { height: 0.5, backgroundColor: "#C6C6C8", marginVertical: 24 },

  carteTitle: { fontSize: 20, fontWeight: "700", color: "#1C1C1E", marginBottom: 2 },
  carteSubtitle: { fontSize: 13, color: "#8E8E93", marginBottom: 20 },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8E8E93",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  platRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  platInfo: { flex: 1 },
  platNom: { fontSize: 15, fontWeight: "600", color: "#1C1C1E", marginBottom: 3 },
  platDescription: { fontSize: 12, color: "#8E8E93", lineHeight: 17 },
  platPrix: { fontSize: 15, fontWeight: "600", color: "#1C1C1E", paddingTop: 1 },
});
