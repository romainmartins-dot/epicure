import { Platform } from "react-native";

// En production : EXPO_PUBLIC_API_URL=https://api.raisin.app dans .env
export const API =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.1.20:3000");
