import { View } from "react-native";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cave/[id]" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="vin/[id]" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack>
    </View>
  );
}
