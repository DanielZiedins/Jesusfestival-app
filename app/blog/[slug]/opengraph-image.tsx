import { ImageResponse } from "next/og";
import { postBySlug } from "@/lib/blog";

export const alt = "A story from Jesus Festival";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  const title = post?.title ?? "Jesus Festival";
  const eyebrow = post?.eyebrow ?? "Jesus Festival story";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          color: "white",
          backgroundImage:
            "radial-gradient(circle at 88% 2%, rgba(247,201,72,.28), transparent 38%), radial-gradient(circle at 4% 98%, rgba(139,92,246,.32), transparent 42%), linear-gradient(145deg,#09040f,#1d0d30 58%,#241105)",
          padding: "76px 88px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, fontWeight: 900, letterSpacing: 4, color: "#F7C948", textTransform: "uppercase" }}>
          <span style={{ display: "flex", width: 42, height: 3, borderRadius: 99, background: "#F7C948" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", maxWidth: 1020, marginTop: 28, fontSize: title.length > 62 ? 58 : 70, lineHeight: 1.04, letterSpacing: -2.5, fontWeight: 900 }}>
          {title}
        </div>
        <div style={{ position: "absolute", left: 88, bottom: 58, right: 88, display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.18)", fontSize: 17, fontWeight: 800, letterSpacing: 1.4, color: "rgba(255,255,255,.62)" }}>
          <span>JESUS FESTIVAL · HAMILTON</span>
          <span>JESUSFESTIVAL.APP</span>
        </div>
      </div>
    ),
    size,
  );
}
