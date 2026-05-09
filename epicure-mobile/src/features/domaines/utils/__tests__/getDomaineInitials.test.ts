import { getDomaineInitials } from "../getDomaineInitials";

describe("getDomaineInitials — sans contexte (comportement initial conservé)", () => {
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

describe("getDomaineInitials — avec contexte (désambiguïsation)", () => {
  const bourgogneCtx = ["Domaine Ballorin", "Domaine Barraud"];

  it("Ballorin seul → DB (standard sans contexte)", () => {
    expect(getDomaineInitials("Domaine Ballorin")).toBe("DB");
  });

  it("Ballorin avec contexte Barraud → BL (stratégie B)", () => {
    expect(getDomaineInitials("Domaine Ballorin", { allDomaines: bourgogneCtx })).toBe("BL");
  });

  it("Barraud avec contexte Ballorin → BR (stratégie B)", () => {
    expect(getDomaineInitials("Domaine Barraud", { allDomaines: bourgogneCtx })).toBe("BR");
  });

  it("sans collision dans le contexte → initiales standard conservées", () => {
    const ctx = ["Domaine Pattes Loup", "Maison Valette", "Yann Bertrand"];
    expect(getDomaineInitials("Domaine Pattes Loup", { allDomaines: ctx })).toBe("PL");
    expect(getDomaineInitials("Maison Valette", { allDomaines: ctx })).toBe("MV");
  });

  it("BL et BR sont distincts", () => {
    const bl = getDomaineInitials("Domaine Ballorin", { allDomaines: bourgogneCtx });
    const br = getDomaineInitials("Domaine Barraud", { allDomaines: bourgogneCtx });
    expect(bl).not.toBe(br);
  });

  it("avec vigneron en fallback stratégie C", () => {
    // Cas hypothétique où B et C s'appellent "Bon Coin" et "Bois Carré" → collision sur "BC"
    // Strategy A: BO / BO → collision; Strategy B: BO / BO → possible collision; vigneron
    const ctx = ["Bon Coin", "Bois Carré"];
    const result = getDomaineInitials("Bon Coin", {
      allDomaines: ctx,
      vigneron: "Gilles Martin",
    });
    // GM (vigneron) or fallback — just ensure it doesn't crash and returns 2 chars
    expect(result).toHaveLength(2);
  });

  it("déterminisme — même appel → même résultat", () => {
    const ctx = ["Domaine Ballorin", "Domaine Barraud"];
    const r1 = getDomaineInitials("Domaine Ballorin", { allDomaines: ctx });
    const r2 = getDomaineInitials("Domaine Ballorin", { allDomaines: ctx });
    expect(r1).toBe(r2);
  });
});
