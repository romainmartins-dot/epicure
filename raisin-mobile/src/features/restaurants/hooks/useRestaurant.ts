import { useMemo } from "react";

import pocData from "../data/restaurant-poc.json";
import { RestaurantPoc } from "../types";

const restaurants = pocData.restaurants as RestaurantPoc[];

export function useRestaurant(id: number): RestaurantPoc | null {
  return useMemo(() => restaurants.find((r) => r.id === id) ?? null, [id]);
}
