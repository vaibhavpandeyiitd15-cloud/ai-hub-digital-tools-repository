import type { ReactNode } from "react";

export function PackagingLabIntroBlock({
  title,
  children,
  accentColor,
}: {
  title?: string;
  children: ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="rounded-xl border bg-white/94 px-5 py-4 shadow-lg backdrop-blur-md"
      style={
        accentColor
          ? { borderColor: `${accentColor}55`, borderLeftWidth: 4, borderLeftColor: accentColor }
          : { borderColor: "rgba(255,255,255,0.8)" }
      }
    >
      {title ? (
        <h2 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
          {title}
        </h2>
      ) : null}
      <div
        className={
          title
            ? "mt-2 text-base font-medium leading-relaxed text-[#1a3352]"
            : "text-base font-medium leading-relaxed text-[#1a3352]"
        }
      >
        {children}
      </div>
    </div>
  );
}
