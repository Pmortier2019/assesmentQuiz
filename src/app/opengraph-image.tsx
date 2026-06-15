import { ImageResponse } from "next/og";

// Site-wide Open Graph / Twitter card image. Static (no request-time APIs),
// so Next.js generates it once at build time and caches it.
export const alt = "Ready to Ace — Free Job Assessment Practice Tests";
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
          backgroundImage: "linear-gradient(135deg, #0D1B2E 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundImage: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: "30px", fontWeight: 700 }}>Ready to Ace</span>
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
