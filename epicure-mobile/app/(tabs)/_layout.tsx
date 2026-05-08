import { StyleSheet, View, useColorScheme } from "react-native";

import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 49;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabBarBackground() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  const separatorColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView style={StyleSheet.absoluteFill} intensity={80} tint={isDark ? "dark" : "light"} />
      <View style={[styles.topBorder, { backgroundColor: separatorColor, top: 0 }]} />
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

export default function TabsLayout() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const activeColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const inactiveColor = "#8E8E93";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          borderTopWidth: 0,
          backgroundColor: isDark ? "rgba(28,28,30,0.94)" : "rgba(255,255,255,0.94)",
          elevation: 0,
        },
        tabBarBackground: () => <TabBarBackground />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Carte",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vins"
        options={{
          title: "Vins",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={(focused ? "wine" : "wine-outline") as IoniconName}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
  topBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
  },
});
