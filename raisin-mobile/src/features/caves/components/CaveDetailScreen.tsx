import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { VinsList } from "../../vins";
import { Cave } from "../types";
import { CaveHeader } from "./CaveHeader";
import { CaveInfo } from "./CaveInfo";

interface Props {
  cave: Cave | null;
  loading: boolean;
}

export function CaveDetailScreen({ cave, loading }: Props) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#C0392B" />
        </View>
      ) : !cave ? (
        <View style={styles.centered}>
          <Text style={styles.errorTxt}>Adresse introuvable</Text>
        </View>
      ) : (
        <>
          <CaveHeader id={cave.id} />
          <CaveInfo cave={cave} />
          <VinsList caveId={cave.id} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  content: { flexGrow: 1, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTxt: { fontSize: 15, color: "#777" },
});
