import { ImageResponse } from "next/og";

// Site-wide Open Graph / Twitter card image. Static (no request-time APIs),
// so Next.js generates it once at build time and caches it.
export const alt = "Ready to Ace | Free Job Assessment Practice Tests";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundImage: "linear-gradient(135deg, #0D1B2E 0%, #15275C 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={42} height={42} viewBox="0 0 40 40" fill="none">
              <path d="M8.5 32 L20 7.5 L31.5 32" stroke="#15275C" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 25 L18.5 31 L30 13" stroke="#2D7BFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: "30px", fontWeight: 700, display: "flex", gap: "9px" }}>
            <span>Ready to</span>
            <span style={{ color: "#2D7BFF" }}>Ace</span>
          </span>
        </div>
        <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
          Free Job Assessment Practice Tests
        </div>
        <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.75)", marginTop: "28px", maxWidth: "880px" }}>
          Practice the real numerical, logical & verbal reasoning tests employers use.
        </div>
      </div>
    ),
    { ...size }
  );
}
