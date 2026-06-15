import { ImageResponse } from "next/og";

// Apple touch icon: forest tile, light-pink "A", white checkmark.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
          backgroundColor: "#2F5233",
        }}
      >
        <svg width={120} height={120} viewBox="0 0 40 40" fill="none">
          <path d="M8.5 32 L20 8 L31.5 32" stroke="#F4BAD4" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 24.5 L18 30 L29 14.5" stroke="#FFFFFF" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
