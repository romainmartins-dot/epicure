import { Dimensions, StyleSheet, View } from "react-native";

import { Image } from "expo-image";

import { Ionicons } from "@expo/vector-icons";

import { usePhoto } from "../../../shared/hooks/usePhoto";

const { width } = Dimensions.get("window");
const PHOTO_HEIGHT = Math.round(width * (9 / 16));

interface Props {
  id: number;
}

export function CaveHeader({ id }: Props) {
  const photo = usePhoto(id);

  if (!photo) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="wine-outline" size={64} color="#C7C7CC" />
      </View>
    );
  }

  return <Image source={photo} style={styles.photo} contentFit="cover" cachePolicy="disk" />;
}

const styles = StyleSheet.create({
  photo: {
    width,
    height: PHOTO_HEIGHT,
  },
  placeholder: {
    width,
    height: PHOTO_HEIGHT,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
});
