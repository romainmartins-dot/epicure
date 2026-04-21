import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import AdresseCard from "../components/AdresseCard";
import { useAdressesList } from "../hooks/useAdressesList";
import { Adresse } from "../utils/types";

interface Props {
  onBack: () => void;
}

export default function ListeView({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { adresses, loading, loadingMore, loadMore, hasMore } = useAdressesList();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.floatingBtn, { left: 16, top: insets.top + 12 }]}
        onPress={onBack}
      >
        <Text style={styles.floatingBtnText}>Carte</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#C0392B" style={{ marginTop: 80 }} />
      ) : (
        <FlatList
          data={adresses}
          keyExtractor={(item: Adresse) => item.id.toString()}
          contentContainerStyle={{
            padding: 16,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 24,
          }}
          renderItem={({ item }: { item: Adresse }) => <AdresseCard item={item} />}
          getItemLayout={(_: unknown, index: number) => ({ length: 94, offset: 94 * index, index })}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}
          removeClippedSubviews
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color="#C0392B" style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  floatingBtn: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingBtnText: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
});
