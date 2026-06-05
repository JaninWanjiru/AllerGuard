/**
 * Brand mark — wordmark + scanner icon. Theme-aware via tokens.
 */
import { ShieldCheck } from "lucide-react";

interface Props {
  size?: "sm" | "md" | "lg";
  hideText?: boolean;
}

export function Logo({ size = "md", hideText }: Props) {
  const dim = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dim} bg-gradient-brand grid place-items-center rounded-xl shadow-steel`}
        aria-hidden
      >
        <ShieldCheck className="text-powder" strokeWidth={2.2} />
      </div>
      {!hideText && (
        <span className={`${text} font-semibold tracking-tight`}>
          Aller<span className="text-coral">Guard</span>
        </span>
      )}
    </div>
  );
}
