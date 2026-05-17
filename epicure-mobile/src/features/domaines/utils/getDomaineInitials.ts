const PREFIXES = new Set(["domaine", "domaines", "maison", "mas", "château", "chateau"]);
const ARTICLES = new Set(["le", "la", "les", "des", "du", "de", "d", "et"]);

function getSignificantWords(nom: string): string[] {
  const words = nom
    .trim()
    .split(/[\s\-]+/)
    .map((w) => w.replace(/[''']/g, ""))
    .filter((w) => w.length > 0);

  const withoutArticles = words.filter((w) => !ARTICLES.has(w.toLowerCase()));

  if (withoutArticles.length >= 3 && PREFIXES.has(withoutArticles[0].toLowerCase())) {
    return withoutArticles.slice(1);
  }
  return withoutArticles;
}

export function getDomaineInitials(nom: string): string {
  const significant = getSignificantWords(nom);
  if (significant.length === 0) return nom.slice(0, 2).toUpperCase();
  if (significant.length === 1) return significant[0].slice(0, 2).toUpperCase();
  return (significant[0][0] + significant[1][0]).toUpperCase();
}
