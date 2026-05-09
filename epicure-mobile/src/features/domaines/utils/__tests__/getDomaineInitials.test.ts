import { getDomaineInitials } from "../getDomaineInitials";

describe("getDomaineInitials", () => {
  // Cas du spec
  it("Domaine Pattes Loup → PL", () => {
    expect(getDomaineInitials("Domaine Pattes Loup")).toBe("PL");
  });

  it("Maison Valette → MV", () => {
    expect(getDomaineInitials("Maison Valette")).toBe("MV");
  });

  it("Yann Bertrand → YB", () => {
    expect(getDomaineInitials("Yann Bertrand")).toBe("YB");
  });

  it("Domaine Pierre André → PA", () => {
    expect(getDomaineInitials("Domaine Pierre André")).toBe("PA");
  });

  it("Les Cailloux du Paradis → CP", () => {
    expect(getDomaineInitials("Les Cailloux du Paradis")).toBe("CP");
  });

  // Cas supplémentaires
  it("Domaine de la Louvetrie → DL (prefix pas supprimé car 2 mots seulement)", () => {
    expect(getDomaineInitials("Domaine de la Louvetrie")).toBe("DL");
  });

  it("Domaine Berlioz → DB (2 mots, prefix conservé)", () => {
    expect(getDomaineInitials("Domaine Berlioz")).toBe("DB");
  });

  it("Domaine Henri Milan → HM (3 mots, prefix supprimé)", () => {
    expect(getDomaineInitials("Domaine Henri Milan")).toBe("HM");
  });

  it("Domaine des Rouges-Queues → RQ (articles + prefix supprimés)", () => {
    expect(getDomaineInitials("Domaine des Rouges-Queues")).toBe("RQ");
  });

  it("Santa Duc → SD", () => {
    expect(getDomaineInitials("Santa Duc")).toBe("SD");
  });

  it("Cosse et Maisonneuve → CM (pas d'articles ignorés)", () => {
    expect(getDomaineInitials("Cosse et Maisonneuve")).toBe("CM");
  });

  it("un seul mot → 2 premières lettres", () => {
    expect(getDomaineInitials("Overnoy")).toBe("OV");
  });
});
