export {
  getAllDomaines,
  getDomaineById,
  getDomainesByRegion,
  getDomainesByCurateur,
} from "./api/domainesApi";
export { useDomaine } from "./hooks/useDomaine";
export { useAllDomaines } from "./hooks/useAllDomaines";
export { useDomainesByRegion } from "./hooks/useDomainesByRegion";
export type { Domaine } from "./types";
