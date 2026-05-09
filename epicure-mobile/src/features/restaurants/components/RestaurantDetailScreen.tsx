import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";

import { Ionicons } from "@expo/vector-icons";

import { Adresse } from "../../adresses/types";
import {
  CartePlat,
  CarteSectionType,
  RestaurantPoc,
  RestaurantVin,
  VinTypeRestaurant,
} from "../types";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * (3 / 4));

const SECTION_LABELS: Record<CarteSectionType, string> = {
  entree: "ENTRÉES",
  plat: "PLATS",
  dessert: "DESSERTS",
};

const SECTIONS: CarteSectionType[] = ["entree", "plat", "dessert"];

const VIN_COLORS: Record<VinTypeRestaurant, string> = {
  blanc: "#C8A84B",
  rouge: "#8B2935",
  rose: "#C4737A",
  petillant: "#7A9BB5",
  doux: "#9E7A4A",
};

const VIN_TYPE_LABELS: Record<VinTypeRestaurant, string> = {
  blanc: "Blanc",
  rouge: "Rouge",
  rose: "Rosé",
  petillant: "Pétillant",
  doux: "Doux",
};

function VinRow({
  vin,
  titleColor,
  bodyColor,
}: {
  vin: RestaurantVin;
  titleColor: string;
  bodyColor: string;
}) {
  const color = VIN_COLORS[vin.type] ?? "#C7C7CC";
  const millesimeLabel = vin.millesime ? String(vin.millesime) : "—";

  return (
    <View style={styles.vinRow}>
      <View style={[styles.vinDot, { backgroundColor: color }]} />
      <View style={styles.vinInfo}>
        <View style={styles.vinTitleRow}>
          <Text style={[styles.vinCuvee, { color: titleColor }]} numberOfLines={1}>
            {vin.cuvee}
          </Text>
          <Text style={styles.vinMillesime}>{millesimeLabel}</Text>
        </View>
        <Text style={styles.vinAppellation} numberOfLines={1}>
          {vin.domaine} · {vin.appellation}
        </Text>
        {vin.note_curateur && (
          <Text style={[styles.vinNote, { color: bodyColor }]} numberOfLines={2}>
            {vin.note_curateur}
          </Text>
        )}
      </View>
      <View style={styles.vinPrix}>
        {vin.prix_verre && (
          <Text style={[styles.vinPrixVerre, { color: titleColor }]}>{vin.prix_verre}€</Text>
        )}
        {vin.prix_bouteille && <Text style={styles.vinPrixBouteille}>{vin.prix_bouteille}€</Text>}
      </View>
    </View>
  );
}

function PlatRow({
  plat,
  titleColor,
  bodyColor,
}: {
  plat: CartePlat;
  titleColor: string;
  bodyColor: string;
}) {
  return (
    <View style={styles.platRow}>
      <View style={styles.platInfo}>
        <Text style={[styles.platNom, { color: titleColor }]}>{plat.nom}</Text>
        <Text style={styles.platDescription} numberOfLines={2}>
          {plat.description}
        </Text>
      </View>
      <Text style={[styles.platPrix, { color: titleColor }]}>{plat.prix}€</Text>
    </View>
  );
}

interface Props {
  adresse: Adresse | null;
  restaurant: RestaurantPoc | null;
  loading: boolean;
}

export function RestaurantDetailScreen({ adresse, restaurant, loading }: Props) {
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
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (!adresse) {
    return (
      <View style={[styles.centered, { backgroundColor: cardBg }]}>
        <Text style={styles.errorTxt}>Adresse introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: scrollBg }]}
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
        <View style={[styles.hero, styles.heroPlaceholder, { backgroundColor: secondaryBg }]}>
          <Ionicons name="restaurant" size={64} color="#C7C7CC" />
        </View>
      )}

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.pullIndicator} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>RESTAURANT</Text>
        </View>

        <Text style={[styles.title, { color: titleColor }]}>{adresse.nom}</Text>
        <Text style={styles.subtitle}>
          {adresse.adresse ? `${adresse.adresse}, ` : ""}
          {adresse.ville}
        </Text>

        {adresse.description ? (
          <Text style={[styles.description, { color: bodyColor }]}>{adresse.description}</Text>
        ) : null}

        {(restaurant?.reservation_url || restaurant?.telephone) && (
          <View style={styles.ctaRow}>
            {restaurant.reservation_url && (
              <Pressable
                style={({ pressed }) => [
                  styles.ctaBtn,
                  styles.ctaBtnPrimary,
                  pressed && styles.ctaBtnPressed,
                ]}
                onPress={() => WebBrowser.openBrowserAsync(restaurant.reservation_url!)}
              >
                <Text style={styles.ctaBtnTextPrimary}>Réserver</Text>
              </Pressable>
            )}
            {restaurant.telephone && (
              <Pressable
                style={({ pressed }) => [
                  styles.ctaBtn,
                  { backgroundColor: secondaryBg },
                  pressed && styles.ctaBtnPressed,
                ]}
                onPress={() => Linking.openURL(`tel:${restaurant.telephone}`)}
              >
                <Text style={[styles.ctaBtnTextSecondary, { color: titleColor }]}>Appeler</Text>
              </Pressable>
            )}
          </View>
        )}

        {restaurant?.vins?.length ? (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <Text style={[styles.carteTitle, { color: titleColor }]}>Vins naturels</Text>
            {restaurant.description_carte_vins ? (
              <Text style={styles.carteSubtitle}>{restaurant.description_carte_vins}</Text>
            ) : null}
            <View style={styles.vinsLegend}>
              {(Object.keys(VIN_COLORS) as VinTypeRestaurant[])
                .filter((t) => restaurant.vins.some((v) => v.type === t))
                .map((t) => (
                  <View key={t} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: VIN_COLORS[t] }]} />
                    <Text style={styles.legendLabel}>{VIN_TYPE_LABELS[t]}</Text>
                  </View>
                ))}
            </View>
            {restaurant.vins.map((vin) => (
              <VinRow key={vin.id} vin={vin} titleColor={titleColor} bodyColor={bodyColor} />
            ))}
          </>
        ) : null}

        {restaurant?.carte?.length ? (
          <>
            <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            <Text style={[styles.carteTitle, { color: titleColor }]}>Carte</Text>
            <Text style={styles.carteSubtitle}>Cuisine de marché · saison en cours</Text>

            {SECTIONS.map((section) => {
              const plats = restaurant.carte.filter((p) => p.section === section);
              if (!plats.length) return null;
              return (
                <View key={section} style={styles.section}>
                  <Text style={styles.sectionLabel}>{SECTION_LABELS[section]}</Text>
                  {plats.map((plat, i) => (
                    <PlatRow key={i} plat={plat} titleColor={titleColor} bodyColor={bodyColor} />
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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  hero: { width, height: HERO_HEIGHT },
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

  title: { fontSize: 34, lineHeight: 41, fontWeight: "700", letterSpacing: 0.37 },
  subtitle: { fontSize: 15, lineHeight: 20, color: "#8E8E93", marginTop: 4 },
  description: { fontSize: 15, lineHeight: 22, marginTop: 12 },

  ctaRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  ctaBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaBtnPrimary: { backgroundColor: "#27AE60" },
  ctaBtnPressed: { opacity: 0.75 },
  ctaBtnTextPrimary: { fontSize: 16, fontWeight: "600", color: "#fff" },
  ctaBtnTextSecondary: { fontSize: 16, fontWeight: "600" },

  separator: { height: 0.5, marginVertical: 24 },

  carteTitle: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
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
  platNom: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  platDescription: { fontSize: 12, color: "#8E8E93", lineHeight: 17 },
  platPrix: { fontSize: 15, fontWeight: "600", paddingTop: 1 },

  vinsLegend: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendLabel: { fontSize: 12, color: "#8E8E93" },

  vinRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F2F2F7",
  },
  vinDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 6, flexShrink: 0 },
  vinInfo: { flex: 1 },
  vinTitleRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  vinCuvee: { flex: 1, fontSize: 15, fontWeight: "600" },
  vinMillesime: { fontSize: 13, color: "#C7C7CC", flexShrink: 0 },
  vinAppellation: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  vinNote: { fontSize: 13, fontStyle: "italic", marginTop: 6, lineHeight: 18 },
  vinPrix: { alignItems: "flex-end", gap: 2, flexShrink: 0 },
  vinPrixVerre: { fontSize: 13, fontWeight: "600" },
  vinPrixBouteille: { fontSize: 11, color: "#8E8E93" },
});
