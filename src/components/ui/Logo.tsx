import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "color" | "tile" | "mono-light";

interface LogoMarkProps {
  size?: number;
  /** color = forest A + pink check (light bg) · tile = forest tile, pink A, white
   *  check (favicon/app icon) · mono-light = all-white (dark backgrounds). */
  tone?: Tone;
  className?: string;
}

/**
 * The "Ready to Ace" mark: an angular "A" with a baby-pink checkmark cutting
 * through its lower half — the brand's forest-green + pink pairing.
 */
export function LogoMark({ size = 32, tone = "color", className }: LogoMarkProps) {
  const tile = tone === "tile";
  const aStroke = tone === "tile" ? "#F4BAD4" : tone === "mono-light" ? "#FFFFFF" : "#2F5233";
  const checkStroke = tone === "tile" ? "#FFFFFF" : tone === "mono-light" ? "#EF96BD" : "#EF96BD";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="Ready to Ace"
      className={className}
    >
      {tile && <rect width="40" height="40" rx="9" fill="#2F5233" />}
      {/* Angular A */}
      <path
        d="M8.5 32 L20 8 L31.5 32"
        stroke={aStroke}
        strokeWidth={tile ? 4 : 4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pink check across the lower half — doubles as the A's crossbar */}
      <path
        d="M12.5 24.5 L18 30 L29 14.5"
        stroke={checkStroke}
        strokeWidth={tile ? 4 : 4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  /** Wraps the logo in a Link to this href. Omit to render plain (e.g. inside an existing Link). */
  href?: string;
  size?: number;
  /** Wordmark + body text colour. dark = forest/ink (light bg) · light = white (dark bg). */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Full lockup: the mark plus the "Ready to Ace" wordmark, with "Ace" in baby
 * pink (mirrors the logo). Drop-in for the navbar, sidebar and footer.
 */
export function Logo({ href, size = 30, variant = "dark", className }: LogoProps) {
  const wordmark = (
    <span
      className={cn(
        "font-display font-bold text-lg tracking-tight leading-none",
        variant === "light" ? "text-white" : "text-[#2F5233]"
      )}
    >
      Ready to <span className="text-[#EF96BD]">Ace</span>
    </span>
  );

  const inner = (
    <span className={cn("inline-flex items-center gap-2 group", className)}>
      <LogoMark size={size} tone={variant === "light" ? "mono-light" : "color"} className="transition-transform group-hover:-rotate-3" />
      {wordmark}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Ready to Ace home">
        {inner}
      </Link>
    );
  }
  return inner;
}
