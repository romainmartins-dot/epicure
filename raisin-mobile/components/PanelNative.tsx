import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Haptics from "expo-haptics";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { usePhoto } from "../hooks/usePhoto";
import { typeCouleur, typeEmoji, typeLabel } from "../utils/formatters";
import { Adresse } from "../utils/types";

interface Props {
  selected: Adresse | null;
  onClose: () => void;
}

const COMPACT_H = 320;
const EXPANDED_H = 520;

const IOS_EASE = Easing.bezier(0.0, 0.0, 0.2, 1.0);
const IOS_EASE_IN = Easing.bezier(0.4, 0.0, 1.0, 1.0);

function haptic(style: Haptics.ImpactFeedbackStyle) {
  if (Platform.OS !== "web") Haptics.impactAsync(style);
}

function PhotoModal({ uri, onClose }: { uri: string; onClose: () => void }) {
  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={styles.fullscreen} activeOpacity={1} onPress={onClose}>
        <Image source={{ uri }} style={styles.fullImage} resizeMode="contain" />
        <Text style={styles.fullClose}>✕</Text>
      </TouchableOpacity>
    </Modal>
  );
}

export default function PanelNative({ selected, onClose }: Props) {
  const [photoPleinEcran, setPhotoPleinEcran] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const photo = usePhoto(selected?.id ?? null);

  const panelH = useSharedValue(0);
  const startH = useSharedValue(0);

  useEffect(() => {
    if (selected) {
      panelH.value = withTiming(COMPACT_H, { duration: 220, easing: IOS_EASE }, () =>
        runOnJS(haptic)(Haptics.ImpactFeedbackStyle.Light),
      );
      setScrollEnabled(false);
    } else {
      panelH.value = withTiming(0, { duration: 160, easing: IOS_EASE_IN });
      setPhotoPleinEcran(false);
      setScrollEnabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const animateClose = () => {
    cancelAnimation(panelH);
    panelH.value = withTiming(0, { duration: 160, easing: IOS_EASE_IN }, () => {
      runOnJS(onClose)();
    });
    setPhotoPleinEcran(false);
    setScrollEnabled(false);
  };

  const snapTo = (target: number, vel: number, isExpand = false) => {
    "worklet";
    const duration = Math.max(120, (target === 0 ? 200 : 260) - Math.abs(vel) * 0.04);
    panelH.value = withTiming(
      target,
      { duration, easing: target === 0 ? IOS_EASE_IN : IOS_EASE },
      (done) => {
        if (done) {
          runOnJS(haptic)(Haptics.ImpactFeedbackStyle.Light);
          runOnJS(setScrollEnabled)(isExpand);
        }
      },
    );
  };

  const gesture = Gesture.Pan()
    .activeOffsetY([-4, 4])
    .failOffsetX([-18, 18])
    .onStart(() => {
      cancelAnimation(panelH);
      startH.value = panelH.value;
    })
    .onUpdate((e) => {
      const next = startH.value - e.translationY;
      panelH.value =
        next > EXPANDED_H ? EXPANDED_H + (next - EXPANDED_H) * 0.05 : Math.max(0, next);
    })
    .onEnd((e) => {
      const vel = -e.velocityY;
      const projected = panelH.value + vel * 0.07;

      if (vel < -1000 || projected < COMPACT_H * 0.4) {
        snapTo(0, Math.abs(e.velocityY));
        runOnJS(haptic)(Haptics.ImpactFeedbackStyle.Medium);
        runOnJS(onClose)();
      } else if (vel > 800 || projected > COMPACT_H + 120) {
        snapTo(EXPANDED_H, Math.abs(vel), true);
      } else {
        snapTo(COMPACT_H, Math.abs(vel));
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      panelH.value,
      [0, COMPACT_H, EXPANDED_H],
      [0, 0.28, 0.48],
      Extrapolation.CLAMP,
    ),
  }));

  const sizeStyle = useAnimatedStyle(() => ({ height: panelH.value }));

  const couleur = selected ? typeCouleur(selected.type) : "#C0392B";

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}
        pointerEvents="none"
      />

      {photoPleinEcran && photo && (
        <PhotoModal uri={photo} onClose={() => setPhotoPleinEcran(false)} />
      )}

      <Animated.View style={[styles.shadow, sizeStyle]} pointerEvents="none" />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.panel, sizeStyle]}>
          <View style={styles.handleZone}>
            <View style={styles.pill} />
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={animateClose}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>

          {selected && (
            <ScrollView
              scrollEnabled={scrollEnabled}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              bounces={false}
            >
              <View style={styles.row}>
                <View style={styles.left}>
                  <View style={[styles.badge, { backgroundColor: couleur + "18" }]}>
                    <Text style={[styles.badgeTxt, { color: couleur }]}>
                      {typeEmoji(selected.type)} {typeLabel(selected.type).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.nom}>{selected.nom}</Text>
                  <Text style={styles.adresse}>
                    📍 {selected.adresse ? `${selected.adresse}, ` : ""}
                    {selected.ville}
                  </Text>
                  {selected.description && (
                    <Text style={styles.desc} numberOfLines={scrollEnabled ? undefined : 2}>
                      {selected.description}
                    </Text>
                  )}
                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: couleur }]}
                      onPress={() =>
                        Linking.openURL(
                          `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`,
                        )
                      }
                    >
                      <Text style={styles.btnTxt}>🗺 Itinéraire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "#F2F2F7" }]}
                      onPress={() =>
                        Linking.openURL(
                          `https://www.google.com/search?q=${encodeURIComponent(selected.nom + " " + selected.ville)}`,
                        )
                      }
                    >
                      <Text style={[styles.btnTxt, { color: "#333" }]}>🔍 Web</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.photoWrap}
                  onPress={() => photo && setPhotoPleinEcran(true)}
                  disabled={!photo}
                >
                  {photo ? (
                    <>
                      <Image source={{ uri: photo }} style={styles.photo} />
                      <View style={styles.agrandir}>
                        <Text style={styles.agrandirTxt}>⛶</Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={{ fontSize: 36 }}>{typeEmoji(selected.type)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "#000" },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    elevation: 28,
  },
  handleZone: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },
  pill: { width: 36, height: 5, backgroundColor: "#D1D1D6", borderRadius: 3 },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  closeTxt: { fontSize: 13, color: "#555", fontWeight: "700" },
  content: { padding: 16, paddingTop: 4 },
  row: { flexDirection: "row", gap: 12 },
  left: { flex: 1, gap: 7 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  badgeTxt: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8 },
  nom: { fontSize: 20, fontWeight: "800", color: "#1a1a1a", lineHeight: 24 },
  adresse: { fontSize: 13, color: "#777" },
  desc: { fontSize: 12, color: "#999", lineHeight: 18 },
  buttons: { flexDirection: "row", gap: 8, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: "center" },
  btnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
  photoWrap: { width: 140, height: 200, borderRadius: 16, overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  agrandir: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  agrandirTxt: { color: "#fff", fontSize: 12, fontWeight: "600" },
  fullscreen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "95%", height: "95%" },
  fullClose: {
    position: "absolute",
    top: 50,
    right: 20,
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
});
