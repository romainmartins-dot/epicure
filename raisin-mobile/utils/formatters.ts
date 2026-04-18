import { AdresseType } from "./types";

export const typeCouleur = (type: AdresseType | string) =>
  type === "cave" ? "#C0392B" : type === "restaurant" ? "#27AE60" : "#2980B9";

export const typeLabel = (type: AdresseType | string) =>
  type === "cave" ? "Cave" : type === "restaurant" ? "Restaurant" : "Bar";

export const typeEmoji = (type: AdresseType | string) =>
  type === "cave" ? "🍾" : type === "restaurant" ? "🍽" : "🍷";
