import { useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Props {
  recherche: string;
  setRecherche: (v: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ recherche, setRecherche, onSubmit }: Props) {
  const clearOpacity = useSharedValue(0);

  useEffect(() => {
    clearOpacity.value = withTiming(recherche.length > 0 ? 1 : 0, { duration: 150 });
  }, [recherche]);

  const clearStyle = useAnimatedStyle(() => ({
    opacity: clearOpacity.value,
    transform: [{ scale: 0.7 + clearOpacity.value * 0.3 }],
  }));

  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher une ville..."
        placeholderTextColor="#999"
        value={recherche}
        onChangeText={setRecherche}
        onSubmitEditing={onSubmit}
      />
      <Animated.View style={clearStyle} pointerEvents={recherche.length > 0 ? "auto" : "none"}>
        <TouchableOpacity onPress={() => setRecherche("")} style={styles.clearBtn}>
          <Text style={styles.clearTxt}>✕</Text>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: "#1a0a00" },
  clearBtn: { padding: 4 },
  clearTxt: { color: "#999", fontSize: 14 },
});
