const PALETTE_LIGHT = ["#FFE5E5", "#E5F4E5", "#E5EEFF", "#FFF0E0", "#F0E5FF", "#FFF8DC"];

const PALETTE_DARK = ["#3A2929", "#293A29", "#29333A", "#3A332A", "#33293A", "#3A372A"];

export function getDomaineAvatarColor(nom: string, isDark: boolean): string {
  const palette = isDark ? PALETTE_DARK : PALETTE_LIGHT;
  let hash = 0;
  for (let i = 0; i < nom.length; i++) {
    hash = (hash * 31 + nom.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}
