import { ImageResponse } from "next/og";
import { KINGDOM_SITES } from "@/lib/content";

export const alt = "The Kingdom Network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for the network hub — the emoji grid reads as "there's a lot here". */
export default function Image() {
  const marks = KINGDOM_SITES.slice(0, 12).map((s) => s.emoji);

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
            top: -180,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(147,51,234,0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "rgba(245,166,35,0.20)",
          }}
        />

        <div
          style={{
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#F5A623",
            fontWeight: 700,
          }}
        >
          One movement, many doors
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 800,
            color: "#ffffff",
            marginTop: 18,
            textAlign: "center",
          }}
        >
          The Kingdom Network
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {marks.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 84,
                height: 84,
                borderRadius: 22,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 42,
              }}
            >
              {m}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 44 }}>
          Love God · Love People · Change the World
        </div>
      </div>
    ),
    size,
  );
}
