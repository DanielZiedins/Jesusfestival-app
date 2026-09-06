import { ImageResponse } from "next/og";

export const alt = "Jesus Festival 2026 — All glory to God";
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
          alignItems: "center",
          overflow: "hidden",
          color: "white",
          backgroundImage:
            "radial-gradient(circle at 50% 12%, rgba(250,190,68,0.34), transparent 38%), radial-gradient(circle at 10% 90%, rgba(139,92,246,0.34), transparent 40%), linear-gradient(145deg,#09040f 0%,#190c29 57%,#251202 100%)",
          padding: 68,
        }}
      >
        <div style={{ position: "absolute", top: 72, left: 82, fontSize: 21, fontWeight: 800, letterSpacing: 4.5, color: "#F7C948" }}>
          JESUS FESTIVAL · HAMILTON 2026
        </div>
        <div style={{ position: "absolute", top: 58, right: 78, display: "flex", height: 72, width: 72, alignItems: "center", justifyContent: "center", border: "2px solid rgba(247,201,72,.5)", borderRadius: 999, fontSize: 38, color: "#F7C948" }}>
          JF
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 26 }}>
          <div style={{ fontSize: 94, lineHeight: 0.92, fontWeight: 900, letterSpacing: -5, textAlign: "center" }}>ALL GLORY</div>
          <div style={{ fontSize: 104, lineHeight: 1, fontWeight: 900, letterSpacing: -5, color: "#F7C948", textAlign: "center" }}>TO GOD.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 42 }}>
          {[
            ["70+", "SALVATIONS REPORTED"],
            ["50+", "BAPTISMS REPORTED"],
            ["3,000+", "HOT DOGS & DRINKS"],
          ].map(([stat, label]) => (
            <div key={stat} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 282, padding: "16px 18px", border: "1px solid rgba(255,255,255,.18)", borderRadius: 18, background: "rgba(255,255,255,.055)" }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#F7C948" }}>{stat}</div>
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: "rgba(255,255,255,.74)" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 42, left: 82, right: 82, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,.58)" }}>
          <span>EARLY REPORTS · SEPTEMBER 6, 2026</span>
          <span>JESUSFESTIVAL.APP</span>
        </div>
      </div>
    ),
    size,
  );
}
