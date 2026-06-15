import { ImageResponse } from "next/og";
import { PRACTICE_PAGES } from "./config";

export const alt = "Ready to Ace practice test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one OG image per practice page so each slug shares a card that
// names its specific test type.
export function generateStaticParams() {
  return Object.keys(PRACTICE_PAGES).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PRACTICE_PAGES[slug];
  const title = page?.title ?? "Job Assessment Practice";
  const category = page?.category ?? "Practice";

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "15px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={38} height={38} viewBox="0 0 40 40" fill="none">
              <path d="M8.5 32 L20 7.5 L31.5 32" stroke="#15275C" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 25 L18.5 31 L30 13" stroke="#2D7BFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, display: "flex", gap: "8px" }}>
            <span>Ready to</span>
            <span style={{ color: "#2D7BFF" }}>Ace</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 18px",
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.1)",
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          {category}
        </div>
        <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.1, maxWidth: "920px" }}>
          {title}
        </div>
        <div style={{ fontSize: "30px", color: "rgba(255,255,255,0.75)", marginTop: "28px" }}>
          Start free — no sign-up required.
        </div>
      </div>
    ),
    { ...size }
  );
}
