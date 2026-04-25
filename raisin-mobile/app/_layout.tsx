import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
        <Stack.Screen
          name="cave/[id]"
          options={{ headerTransparent: true, headerTitle: "", headerTintColor: "#fff" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
