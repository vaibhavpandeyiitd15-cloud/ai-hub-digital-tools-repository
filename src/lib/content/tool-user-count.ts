/** Stable pseudo-random user count (20–40) per tool slug for display on cards */
export function getToolUserCount(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return 20 + (hash % 21);
}
