import { ImageResponse } from "next/og";
import { BLOG_POSTS, postBySlug } from "@/lib/blog";

export const alt = "Jesus Festival";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

/**
 * A branded share card per article. Without this every link shared to Facebook,
 * WhatsApp or iMessage shows the same generic banner — with it, each one gets
 * its own title, which is what makes people actually click.
 */
export default function Image({ params }: { params: { slug: string } }) {
  const post = postBySlug(params.slug);
  const title = post?.title ?? "The Jesus Festival Blog";
  const eyebrow = post?.eyebrow ?? "Jesus Festival";
  const emoji = post?.emoji ?? "✝️";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #12081F 0%, #1B0F2E 55%, #2A1206 100%)",
          padding: 72,
        }}
      >
        {/* ambient glows */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(245,166,35,0.20)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(147,51,234,0.28)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 52 }}>{emoji}</div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#F5A623",
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 52 ? 62 : 74,
            lineHeight: 1.08,
            fontWeight: 800,
            color: "#ffffff",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#ffffff" }}>Jesus Festival</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
              Hamilton · Sept 4–5, 2026 · Gage Park
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#1a0f00",
              background: "linear-gradient(90deg,#F7C948,#F5A623)",
              padding: "14px 28px",
              borderRadius: 999,
            }}
          >
            jesusfestival.app
          </div>
        </div>
      </div>
    ),
    size,
  );
}
