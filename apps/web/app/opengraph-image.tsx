import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "imlogram.uz — Özbek alifbosi konvertatsiyasi";

export default function OpengraphImage() {
  const logoBase64 = readFileSync(join(process.cwd(), "app", "icon.png")).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4338ca 0%, #6366f1 55%, #818cf8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={168} height={168} style={{ borderRadius: "50%" }} alt="" />
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "white", marginTop: 36 }}>
          imlogram.uz
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "rgba(255,255,255,0.88)",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          Özbek alifbosini işonçli konvertatsiya qiling
        </div>
      </div>
    ),
    { ...size },
  );
}
