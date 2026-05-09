const ARTICLES = new Set(["le", "la", "les", "des", "du", "de", "d", "et"]);
const PREFIXES = new Set(["domaine", "domaines", "maison", "mas", "château", "chateau"]);

function getSignificantWords(nom: string): string[] {
  const words = nom
    .trim()
    .split(/[\s\-]+/)
    .map((w) => w.replace(/[''']/g, ""))
    .filter((w) => w.length > 0);

  const withoutArticles = words.filter((w) => !ARTICLES.has(w.toLowerCase()));

  let significant = withoutArticles;
  if (significant.length >= 3 && PREFIXES.has(significant[0].toLowerCase())) {
    significant = significant.slice(1);
  }

  return significant;
}

function computeStandard(significant: string[]): string {
  if (significant.length === 1) return significant[0].slice(0, 2).toUpperCase();
  return (significant[0][0] + significant[1][0]).toUpperCase();
}

function stratA(significant: string[]): string | null {
  const last = significant[significant.length - 1];
  return last.length >= 2 ? (last[0] + last[1]).toUpperCase() : null;
}

function stratB(significant: string[]): string | null {
  const last = significant[significant.length - 1];
  return last.length >= 3 ? (last[0] + last[2]).toUpperCase() : null;
}

export function getDomaineInitials(
  nom: string,
  options?: { vigneron?: string; allDomaines?: string[] },
): string {
  const significant = getSignificantWords(nom);

  if (significant.length === 0) {
    return nom.slice(0, 2).toUpperCase();
  }

  const standard = computeStandard(significant);

  if (!options?.allDomaines || options.allDomaines.length <= 1) {
    return standard;
  }

  // Find colliders: other domaines that share the same standard initials
  const colliders = options.allDomaines.filter((d) => {
    const sig = getSignificantWords(d);
    return sig.length > 0 && computeStandard(sig) === standard;
  });

  if (colliders.length <= 1) return standard;

  // Strategy A: first + second letter of last significant word
  const aValues = colliders.map((d) => stratA(getSignificantWords(d)));
  if (aValues.every((v) => v !== null) && new Set(aValues).size === aValues.length) {
    return stratA(significant)!;
  }

  // Strategy B: first + third letter of last significant word
  const bValues = colliders.map((d) => stratB(getSignificantWords(d)));
  if (bValues.every((v) => v !== null) && new Set(bValues).size === bValues.length) {
    return stratB(significant)!;
  }

  // Strategy C: vigneron initials if provided and unique in context
  if (options.vigneron) {
    const vigWords = options.vigneron.trim().split(/\s+/).filter(Boolean);
    if (vigWords.length >= 2) {
      const vigInitials = (vigWords[0][0] + vigWords[vigWords.length - 1][0]).toUpperCase();
      const otherStandards = options.allDomaines
        .filter((d) => d !== nom)
        .map((d) => {
          const sig = getSignificantWords(d);
          return sig.length > 0 ? computeStandard(sig) : "";
        });
      if (!otherStandards.includes(vigInitials)) return vigInitials;
    }
  }

  // Fallback: best available strategy
  return stratB(significant) ?? stratA(significant) ?? standard;
}
