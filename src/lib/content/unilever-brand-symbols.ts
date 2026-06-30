/** 24 Unilever brand symbols for the hero marquee — reorder or swap entries here. */
export type BrandSymbol = {
  id: string;
  label: string;
  src: string;
};

export const UNILEVER_LOGO_U_SRC = "/assets/unilever-logo-u-white.png";

export const UNILEVER_BRAND_SYMBOLS: BrandSymbol[] = [
  { id: "sun", label: "Sun", src: "/logo-icons/sun.png" },
  { id: "hand", label: "Hand", src: "/logo-icons/hand.png" },
  { id: "flower", label: "Flower", src: "/logo-icons/flower.png" },
  { id: "dna", label: "DNA", src: "/logo-icons/dna.png" },
  { id: "bee", label: "Bee", src: "/logo-icons/bee.png" },
  { id: "hair", label: "Hair", src: "/logo-icons/hair.png" },
  { id: "lips", label: "Lips", src: "/logo-icons/lips.png" },
  { id: "palm", label: "Palm tree", src: "/logo-icons/palm.png" },
  { id: "fish", label: "Fish", src: "/logo-icons/fish.png" },
  { id: "waves", label: "Waves", src: "/logo-icons/waves.png" },
  { id: "heart", label: "Heart", src: "/logo-icons/heart.png" },
  { id: "bowl", label: "Bowl", src: "/logo-icons/bowl.png" },
  { id: "spoon", label: "Spoon", src: "/logo-icons/spoon.png" },
  { id: "pepper", label: "Chilli", src: "/logo-icons/pepper.png" },
  { id: "icecream", label: "Ice cream", src: "/logo-icons/icecream.png" },
  { id: "dove", label: "Bird", src: "/logo-icons/dove.png" },
  { id: "plant", label: "Plant", src: "/logo-icons/plant.png" },
  { id: "clothes", label: "Shirt", src: "/logo-icons/clothes.png" },
  { id: "packaging", label: "Package", src: "/logo-icons/packaging.png" },
  { id: "particles", label: "Particles", src: "/logo-icons/particles.png" },
  { id: "transformation", label: "Butterfly", src: "/logo-icons/transformation.png" },
  { id: "virtuous_cycle", label: "Recycle", src: "/logo-icons/virtuous_cycle.png" },
  { id: "spark", label: "Spark", src: "/logo-icons/spark.png" },
  { id: "swirl", label: "Spirit", src: "/logo-icons/swirl.png" },
];

/** Seamless loop: two full copies back-to-back. */
export const UNILEVER_BRAND_SYMBOLS_LOOP = [
  ...UNILEVER_BRAND_SYMBOLS,
  ...UNILEVER_BRAND_SYMBOLS,
];

export const HERO_MARQUEE_ROW1_DURATION = 40;
export const HERO_MARQUEE_ROW2_DURATION = 55;
export const HERO_MARQUEE_PLAY_MS = 4500;
export const HERO_MARQUEE_HANDOFF_S = 1;
