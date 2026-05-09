import { useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  recherche: string;
  setRecherche: (v: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ recherche, setRecherche, onSubmit }: Props) {
  const isDark = useColorScheme() === "dark";
  const clearOpacity = useSharedValue(0);

  useEffect(() => {
    clearOpacity.value = withTiming(recherche.length > 0 ? 1 : 0, { duration: 150 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recherche]);

  const clearStyle = useAnimatedStyle(() => ({
    opacity: clearOpacity.value,
    transform: [{ scale: 0.7 + clearOpacity.value * 0.3 }],
  }));

  const bgColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const inputColor = isDark ? "#FFFFFF" : "#1A1A1A";

  return (
    <View style={[styles.searchBar, { backgroundColor: bgColor }]}>
      <Ionicons name="search" size={16} color="#999" style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: inputColor }]}
        placeholder="Rechercher une ville..."
        placeholderTextColor="#999"
        value={recherche}
        onChangeText={setRecherche}
        onSubmitEditing={onSubmit}
      />
      <Animated.View style={clearStyle} pointerEvents={recherche.length > 0 ? "auto" : "none"}>
        <TouchableOpacity onPress={() => setRecherche("")} style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color="#C7C7CC" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15 },
  clearBtn: { padding: 4 },
});
