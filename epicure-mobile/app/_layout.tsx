import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cave/[id]" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="vin/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="domaine/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="curateur/[id]" options={{ headerShown: false, presentation: "card" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
