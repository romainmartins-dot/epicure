import path from "path";

// Files relative to each workspace root, so prettier picks up the right config + plugins
const toMobileRelative = (files) =>
  files.map((f) => path.relative("/Users/romain/epicure/raisin-mobile", f));

export default {
  // API (root workspace) — JS + JSON outside raisin-mobile
  "!(raisin-mobile)/**/*.{js,json}": ["prettier --write"],
  "*.{js,json}": ["prettier --write"],

  // Mobile — format with mobile's own prettier (has sort-imports plugin)
  "raisin-mobile/**/*.{ts,tsx,json}": (files) => {
    const rel = toMobileRelative(files).join(" ");
    return [`sh -c 'cd raisin-mobile && npx prettier --write ${rel}'`];
  },

  // Mobile — typecheck on any TS change (no file args — tsc ignores them)
  "raisin-mobile/**/*.{ts,tsx}": () => ["sh -c 'cd raisin-mobile && npx tsc --noEmit'"],
};
