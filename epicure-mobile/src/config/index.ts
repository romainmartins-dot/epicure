export const INITIAL_REGION = {
  latitude: 50.6343,
  longitude: 3.0639,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
} as const;

// Supercluster(radius=300, extent=512) + iPhone portrait aspect 0.461
// → zoom 11 requis → latitudeDelta ≥ 0.27
export const MIN_CLUSTER_DELTA = 0.27;
