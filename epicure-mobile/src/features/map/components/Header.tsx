import { StyleSheet, Text, View, useColorScheme } from "react-native";

export default function Header() {
  const isDark = useColorScheme() === "dark";
  const borderColor = isDark ? "#38383A" : "#E0E0E0";
  const bgColor = isDark ? "#1C1C1E" : "#fff";
  const titleColor = isDark ? "#FFFFFF" : "#1C1C1E";

  return (
    <View style={[styles.header, { backgroundColor: bgColor, borderBottomColor: borderColor }]}>
      <Text style={[styles.titre, { color: titleColor }]}>Epicure</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  titre: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
