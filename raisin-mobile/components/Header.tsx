import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Vue = "carte" | "liste";

interface Props {
  vue: Vue;
  setVue: (v: Vue) => void;
}

export default function Header({ vue, setVue }: Props) {
  const [pillWidth, setPillWidth] = useState(0);
  const progress = useSharedValue(0); // 0 = carte, 1 = liste

  useEffect(() => {
    progress.value = withSpring(vue === "carte" ? 0 : 1, {
      damping: 20,
      stiffness: 300,
    });
  }, [vue]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * pillWidth }],
  }));

  const carteTxtStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ["#1a0a00", "#999"]),
  }));

  const listeTxtStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ["#999", "#1a0a00"]),
  }));

  return (
    <View style={styles.header}>
      <Text style={styles.titre}>🍷 Raisin</Text>
      <View style={styles.toggle} onLayout={(e) => setPillWidth(e.nativeEvent.layout.width / 2)}>
        <Animated.View style={[styles.pill, { width: pillWidth - 2 }, pillStyle]} />
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setVue("carte")}>
          <Animated.Text style={[styles.toggleTxt, carteTxtStyle]}>Carte</Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setVue("liste")}>
          <Animated.Text style={[styles.toggleTxt, listeTxtStyle]}>Liste</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  titre: { fontSize: 22, fontWeight: "800", color: "#1a0a00", letterSpacing: 0.5 },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 2,
    position: "relative",
  },
  pill: {
    position: "absolute",
    top: 2,
    left: 2,
    bottom: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  toggleTxt: { fontSize: 14, fontWeight: "600" },
});
