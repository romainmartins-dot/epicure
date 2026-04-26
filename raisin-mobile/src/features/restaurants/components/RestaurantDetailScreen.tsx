import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { Ionicons } from "@expo/vector-icons";

import { Adresse } from "../../adresses/types";
import { CarteVin, CarteVinType, RestaurantPoc } from "../types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * (3 / 4));

const TYPE_COLORS: Record<CarteVinType, string> = {
  blanc: "#F0A500",
  rouge: "#C0392B",
  rose: "#E07080",
  petillant: "#5B9BD5",
  doux: "#8E44AD",
};

function CarteVinRow({ vin }: { vin: CarteVin }) {
  const color = TYPE_COLORS[vin.type];
  const millesime = vin.millesime ? String(vin.millesime) : "Assemblage";
  return (
    <View style={styles.vinRow}>
      <View style={[styles.vinDot, { backgroundColor: color }]} />
      <View style={styles.vinInfo}>
        <Text style={styles.vinCuvee} numberOfLines={1}>
          {vin.cuvee}
        </Text>
        <Text style={styles.vinMeta} numberOfLines={1}>
          {vin.domaine} · {vin.appellation} · {millesime}
        </Text>
      </View>
      <View style={styles.vinPrix}>
        {vin.prix_verre ? <Text style={styles.vinPrixVerre}>{vin.prix_verre}€ /v</Text> : null}
        <Text style={styles.vinPrixBouteille}>{vin.prix_bouteille}€</Text>
      </View>
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

        {restaurant?.carte_vins?.length ? (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Carte des vins</Text>
            <Text style={styles.sectionSubtitle}>Sélection naturelle · vins du moment</Text>
            <View style={styles.vinList}>
              {restaurant.carte_vins.map((vin, i) => (
                <CarteVinRow key={i} vin={vin} />
              ))}
            </View>
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

  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1C1C1E", marginBottom: 2 },
  sectionSubtitle: { fontSize: 13, color: "#8E8E93", marginBottom: 16 },

  vinList: { gap: 0 },
  vinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  vinDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  vinInfo: { flex: 1 },
  vinCuvee: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  vinMeta: { fontSize: 12, color: "#8E8E93", marginTop: 1 },
  vinPrix: { alignItems: "flex-end", gap: 1 },
  vinPrixVerre: { fontSize: 12, color: "#8E8E93" },
  vinPrixBouteille: { fontSize: 14, fontWeight: "600", color: "#1C1C1E" },
});
