import Image from "next/image";
import { BRAND_WORLD_DECOR } from "@/lib/content/brand-world";
import { cn } from "@/lib/utils";

type BrandWorldBackgroundProps = {
  /** Softer treatment for dense content pages */
  subtle?: boolean;
  className?: string;
};

export function BrandWorldBackground({ subtle = false, className }: BrandWorldBackgroundProps) {
  return (
    <div
      className={cn(
        "brand-world-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        subtle && "brand-world-bg-subtle",
        className,
      )}
      aria-hidden
    >
      <div className="brand-world-mesh" />
      <div className="brand-world-decor">
        <div className="brand-world-blob brand-world-blob-coral" />
        <div className="brand-world-blob brand-world-blob-green" />
        <div className="brand-world-blob brand-world-blob-sun" />
        <div className="brand-world-blob brand-world-blob-blue" />

        <svg
          className="brand-world-curve brand-world-curve-1"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M80 200c40-80 120-120 200-80s100 140 40 200-160 40-240-120Z"
            fill="url(#brandCurveGreen)"
          />
          <defs>
            <linearGradient id="brandCurveGreen" x1="0" y1="0" x2="400" y2="400">
              <stop stopColor="#00C389" stopOpacity="0.28" />
              <stop offset="1" stopColor="#0033A0" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="brand-world-curve brand-world-curve-2"
          viewBox="0 0 360 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M280 60c-60 40-100 100-80 180s100 100 60 80-140-20-180-100 80-200 200-160Z"
            fill="url(#brandCurveCoral)"
          />
          <defs>
            <linearGradient id="brandCurveCoral" x1="360" y1="0" x2="0" y2="360">
              <stop stopColor="#FF6B4A" stopOpacity="0.24" />
              <stop offset="1" stopColor="#FFC72C" stopOpacity="0.14" />
            </linearGradient>
          </defs>
        </svg>

        {BRAND_WORLD_DECOR.map((item) => (
          <div
            key={item.id}
            className={cn("brand-world-icon hidden lg:flex", `brand-world-icon-${item.tint}`)}
            style={{
              top: item.top,
              left: "left" in item ? item.left : undefined,
              right: "right" in item ? item.right : undefined,
              width: item.size,
              height: item.size,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Image
              src={item.src}
              alt=""
              width={item.size}
              height={item.size}
              className="brand-world-icon-img"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
