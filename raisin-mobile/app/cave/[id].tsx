import { StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { CaveDetailScreen, useCave } from "../../src/features/caves";

export default function CavePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cave, loading } = useCave(Number(id));

  return (
    <View style={styles.container}>
      <CaveDetailScreen cave={cave} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
