import path from "path";

// Files relative to each workspace root, so prettier picks up the right config + plugins
const toMobileRelative = (files) =>
  files.map((f) => path.relative("/Users/romain/epicure/epicure-mobile", f));

export default {
  // API (root workspace) — JS + JSON outside epicure-mobile
  "!(epicure-mobile)/**/*.{js,json}": ["prettier --write"],
  // Root-level only — filter out epicure-mobile files to avoid plugin resolution issues
  "*.{js,json}": (files) => {
    const root = files.filter((f) => !f.includes("/epicure-mobile/"));
    return root.length ? [`prettier --write ${root.join(" ")}`] : [];
  },

  // Mobile — format with mobile's own prettier (has sort-imports plugin)
  "epicure-mobile/**/*.{ts,tsx,json}": (files) => {
    const rel = toMobileRelative(files).join(" ");
    return [`sh -c 'cd epicure-mobile && npx prettier --write ${rel}'`];
  },

  // Mobile — typecheck on any TS change (no file args — tsc ignores them)
  "epicure-mobile/**/*.{ts,tsx}": () => ["sh -c 'cd epicure-mobile && npx tsc --noEmit'"],
};
