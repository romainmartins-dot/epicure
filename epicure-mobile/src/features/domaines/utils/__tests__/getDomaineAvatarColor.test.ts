import { getDomaineAvatarColor } from "../getDomaineAvatarColor";

describe("getDomaineAvatarColor", () => {
  it("déterminisme — même nom toujours même couleur", () => {
    const c1 = getDomaineAvatarColor("Domaine Pattes Loup", false);
    const c2 = getDomaineAvatarColor("Domaine Pattes Loup", false);
    expect(c1).toBe(c2);
  });

  it("light vs dark — même nom, palettes différentes", () => {
    const light = getDomaineAvatarColor("Maison Valette", false);
    const dark = getDomaineAvatarColor("Maison Valette", true);
    expect(light).not.toBe(dark);
  });

  it("light vs dark — même index de palette", () => {
    const PALETTE_LIGHT = ["#FFE5E5", "#E5F4E5", "#E5EEFF", "#FFF0E0", "#F0E5FF", "#FFF8DC"];
    const PALETTE_DARK = ["#3A2929", "#293A29", "#29333A", "#3A332A", "#33293A", "#3A372A"];
    for (let i = 0; i < PALETTE_LIGHT.length; i++) {
      expect(PALETTE_LIGHT).toContain(getDomaineAvatarColor(`test-${i}a`, false));
      expect(PALETTE_DARK).toContain(getDomaineAvatarColor(`test-${i}a`, true));
    }
  });

  it("distribution — 10 noms différents → au moins 4 couleurs distinctes", () => {
    const noms = [
      "Domaine Pattes Loup",
      "Maison Valette",
      "Yann Bertrand",
      "Santa Duc",
      "Overnoy",
      "Domaine Ballorin",
      "Domaine Barraud",
      "Cosse et Maisonneuve",
      "Domaine Henri Milan",
      "Les Cailloux du Paradis",
    ];
    const colors = new Set(noms.map((n) => getDomaineAvatarColor(n, false)));
    expect(colors.size).toBeGreaterThanOrEqual(4);
  });

  it("retourne une couleur valide (hex 7 chars)", () => {
    const color = getDomaineAvatarColor("Domaine Test", false);
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
