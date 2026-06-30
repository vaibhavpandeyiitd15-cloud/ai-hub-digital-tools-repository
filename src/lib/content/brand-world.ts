/** Every U Does Good–inspired campaign palette (Unilever global identity refresh). */
export const BRAND_WORLD_COLORS = {
  coral: "#FF6B4A",
  sun: "#FFC72C",
  sky: "#4DA6FF",
  mint: "#00C389",
  blue: "#0033A0",
  blueDeep: "#001E62",
  cream: "#FAFBF7",
} as const;

/** Floating U-icon illustrations — pinned to side margins (outside content column). */
export const BRAND_WORLD_DECOR = [
  { id: "sun", src: "/logo-icons/sun.png", tint: "sun", top: "10%", left: "1%", size: 52, delay: 0 },
  { id: "flower", src: "/logo-icons/flower.png", tint: "coral", top: "22%", right: "1%", size: 46, delay: 1.2 },
  { id: "dove", src: "/logo-icons/dove.png", tint: "sky", top: "48%", left: "0.5%", size: 42, delay: 2.4 },
  { id: "waves", src: "/logo-icons/waves.png", tint: "mint", top: "58%", right: "0.5%", size: 48, delay: 0.8 },
  { id: "heart", src: "/logo-icons/heart.png", tint: "coral", top: "76%", left: "2%", size: 38, delay: 1.8 },
  { id: "plant", src: "/logo-icons/plant.png", tint: "mint", top: "82%", right: "2%", size: 44, delay: 3 },
  { id: "fish", src: "/logo-icons/fish.png", tint: "sky", top: "34%", right: "1.5%", size: 40, delay: 2 },
  { id: "hand", src: "/logo-icons/hand.png", tint: "sun", top: "66%", left: "1.5%", size: 36, delay: 1.5 },
] as const;

export type BrandWorldTint = (typeof BRAND_WORLD_DECOR)[number]["tint"];
