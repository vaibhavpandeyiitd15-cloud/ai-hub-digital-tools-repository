import { BrandWorldBackground } from "@/components/ui/BrandWorldBackground";
import { cn } from "@/lib/utils";

type PublicPageShellProps = {
  children: React.ReactNode;
  /** Lighter background for tool catalog and detail pages */
  subtle?: boolean;
  className?: string;
};

export function PublicPageShell({ children, subtle, className }: PublicPageShellProps) {
  return (
    <div className={cn("relative min-h-full", className)}>
      <BrandWorldBackground subtle={subtle} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
