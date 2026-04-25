import { Vin } from "../src/features/vins/types";

const mockVins: Vin[] = [
  {
    id: 1,
    cave_id: 2061,
    domaine: "Domaine Pattes Loup",
    vigneron: "Thomas Pico",
    cuvee: "Chablis",
    millesime: 2018,
    so2_libre: "< 3 mg/l",
    so2_total: "29 mg/l",
    mise: "06/2022",
    description:
      "Un Chablis d'une précision minérale rare. Thomas Pico travaille en biodynamie sur ses parcelles de Courgis — vendanges manuelles, zéro intrant. Ce 2018 s'exprime sur la craie et l'iode, avec une tension ciselée et une longueur qui surprend.",
    accords: ["Huîtres", "Saint-Jacques poêlées", "Poisson en beurre blanc", "Chèvre frais"],
  },
];

export default mockVins;
