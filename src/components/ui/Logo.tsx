import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: number;
  /** color = navy A + blue check (light bg) · mono-light = all-white (dark backgrounds). */
  tone?: "color" | "mono-light";
  className?: string;
}

/**
 * The "Ready to Ace" mark: an angular "A" with a blue checkmark cutting through
 * its lower half. Colours sampled from the brand icon (navy #15275C / blue #2D7BFF).
 */
export function LogoMark({ size = 32, tone = "color", className }: LogoMarkProps) {
  const aStroke = tone === "mono-light" ? "#FFFFFF" : "#15275C";
  const checkStroke = tone === "mono-light" ? "#2D7BFF" : "#2D7BFF";

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
      {/* Angular A */}
      <path
        d="M8.5 32 L20 7.5 L31.5 32"
        stroke={aStroke}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Blue check across the lower half — doubles as the A's crossbar */}
      <path
        d="M12 25 L18.5 31 L30 13"
        stroke={checkStroke}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
