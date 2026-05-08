import { Pressable, StyleSheet } from "react-native";

import * as Haptics from "expo-haptics";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

import { useFavoriVin } from "../hooks/useFavoriVin";

interface Props {
  vinId: string;
  top?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FavoriButton({ vinId, top = 16 }: Props) {
  const { isFavorite, toggle } = useFavoriVin(vinId);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handlePress() {
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1.0, { duration: 100 }),
    );
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggle();
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.btn, { top }, animStyle]}
      accessibilityLabel={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      accessibilityRole="button"
      hitSlop={8}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite ? "#FF3B30" : "#8E8E93"}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    top: 16,
    right: 16,
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
  },
});
