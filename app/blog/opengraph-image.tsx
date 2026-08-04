import { ImageResponse } from "next/og";
import { BLOG_POSTS } from "@/lib/blog";

export const alt = "The Jesus Festival Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for the blog index. */
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
          alignItems: "center",
          background: "linear-gradient(135deg, #12081F 0%, #1B0F2E 55%, #2A1206 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -130,
            width: 540,
            height: 540,
            borderRadius: 9999,
            background: "rgba(245,166,35,0.20)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -190,
            left: -130,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(147,51,234,0.28)",
          }}
        />

        <div style={{ fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#F5A623", fontWeight: 700 }}>
          Jesus Festival · Hamilton 2026
        </div>

        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, color: "#ffffff", marginTop: 16 }}>
          The Blog
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(255,255,255,0.62)",
            marginTop: 18,
            textAlign: "center",
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          Encouragement, practical faith, and the story behind what God is doing in Hamilton.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#1a0f00",
            background: "linear-gradient(90deg,#F7C948,#F5A623)",
            padding: "16px 32px",
            borderRadius: 999,
          }}
        >
          {BLOG_POSTS.length} reads · jesusfestival.app/blog
        </div>
      </div>
    ),
    size,
  );
}
