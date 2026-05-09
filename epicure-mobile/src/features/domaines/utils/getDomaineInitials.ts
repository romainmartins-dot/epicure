const ARTICLES = new Set(["le", "la", "les", "des", "du", "de", "d", "et"]);
const PREFIXES = new Set(["domaine", "domaines", "maison", "mas", "château", "chateau"]);

export function getDomaineInitials(nom: string): string {
  const words = nom
    .trim()
    .split(/[\s\-]+/)
    .map((w) => w.replace(/[''']/g, ""))
    .filter((w) => w.length > 0);

  // Remove articles/prepositions
  const withoutArticles = words.filter((w) => !ARTICLES.has(w.toLowerCase()));

  // Remove leading prefix only if 3+ words remain after removal
  let significant = withoutArticles;
  if (significant.length >= 3 && PREFIXES.has(significant[0].toLowerCase())) {
    significant = significant.slice(1);
  }

  if (significant.length === 0) {
    return nom.slice(0, 2).toUpperCase();
  }

  if (significant.length === 1) {
    return significant[0].slice(0, 2).toUpperCase();
  }

  return (significant[0][0] + significant[1][0]).toUpperCase();
}
