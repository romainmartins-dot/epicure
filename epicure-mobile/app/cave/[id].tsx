import { ActivityIndicator, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { CaveDetailScreen, useCave } from "../../src/features/caves";
import { CaveHeader, PHOTO_HEIGHT } from "../../src/features/caves/components/CaveHeader";
import { usePhoto } from "../../src/shared/hooks/usePhoto";

const NAV_BAR_HEIGHT = 44;
const FADE_START = PHOTO_HEIGHT - 100;
const FADE_END = PHOTO_HEIGHT;

export default function CavePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { cave, loading } = useCave(Number(id));
  const photo = usePhoto(cave ? cave.id : null);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const navBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [FADE_START, FADE_END], [0, 1], Extrapolation.CLAMP),
  }));

  const isDark = colorScheme === "dark";
  const navBarBg = isDark ? "rgba(28,28,30,0.94)" : "rgba(255,255,255,0.94)";
  const navBarTitleColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const navBarBorderColor = isDark ? "#38383A" : "#C6C6C8";

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C0392B" />
        </View>
        <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={goBack}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </Pressable>
      </View>
    );
  }

  if (!cave) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="auto" />
        <Text style={styles.errorTxt}>Adresse introuvable</Text>
        <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={goBack}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </Pressable>
      </View>
    );
  }

  const containerBg = isDark ? "#1C1C1E" : "#FFFFFF";

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <StatusBar style="light" />

      {/* Background photo — fixed behind scrollable content */}
      <View style={styles.photoContainer}>
        <CaveHeader id={cave.id} />
      </View>

      {/* Scrollable content — transparent top reveals photo */}
      <CaveDetailScreen cave={cave} scrollHandler={scrollHandler} />

      {/* Animated nav bar — fades in as title scrolls out of view */}
      <Animated.View
        style={[
          styles.navBar,
          { height: NAV_BAR_HEIGHT + insets.top, backgroundColor: navBarBg },
          navBarStyle,
        ]}
        pointerEvents="none"
      >
        <View style={[styles.navBarInner, { paddingTop: insets.top }]}>
          <Text style={[styles.navBarTitle, { color: navBarTitleColor }]} numberOfLines={1}>
            {cave.nom}
          </Text>
        </View>
        <View style={[styles.navBarBorder, { backgroundColor: navBarBorderColor }]} />
      </Animated.View>

      {/* Back button — always visible, above nav bar */}
      <Pressable style={[styles.backBtn, { top: insets.top + 8 }]} onPress={goBack}>
        <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#8E8E93" },

  photoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },

  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navBarInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  navBarTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  navBarBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 0.5,
  },

  backBtn: {
    position: "absolute",
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    zIndex: 20,
  },
});
