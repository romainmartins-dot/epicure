import { useColorScheme } from "react-native";

import { Tabs } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 49;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabsLayout() {
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const activeColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const inactiveColor = "#8E8E93";
  const bgColor = isDark ? "rgba(28,28,30,0.94)" : "rgba(255,255,255,0.94)";
  const borderColor = isDark ? "#38383A" : "#C6C6C8";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          backgroundColor: bgColor,
          borderTopWidth: 0.5,
          borderTopColor: borderColor,
          elevation: 0,
        },
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
      <Tabs.Screen
        name="favoris"
        options={{
          title: "Favoris",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// StyleSheet inline ici car seul tabBarLabelStyle en a besoin
const styles = { label: { fontSize: 10 as const, fontWeight: "500" as const } };
