import {
  Bird,
  Fish,
  Flower2,
  HandHeart,
  Leaf,
  Sparkles,
  Sun,
  TreePalm,
  Waves,
} from "lucide-react";

/** Vitality motif strip — inspired by Unilever U logo's nature & life icons */
const MOTIFS = [
  { Icon: Sun, label: "Vitality" },
  { Icon: Leaf, label: "Nature" },
  { Icon: Waves, label: "Water" },
  { Icon: HandHeart, label: "Care" },
  { Icon: Flower2, label: "Growth" },
  { Icon: Fish, label: "Life" },
  { Icon: Bird, label: "Freedom" },
  { Icon: TreePalm, label: "World" },
  { Icon: Sparkles, label: "Innovation" },
] as const;

export function VitalityStrip() {
  return (
    <div className="vitality-strip overflow-hidden border-y border-white/10 bg-brand-dark/95 py-3">
      <div className="vitality-marquee flex gap-10">
        {[...MOTIFS, ...MOTIFS].map(({ Icon, label }, i) => (
          <div
            key={`${label}-${i}`}
            className="flex shrink-0 items-center gap-2 text-white/70"
          >
            <Icon className="h-4 w-4 text-success/80" strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
