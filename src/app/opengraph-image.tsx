import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/settings";

export const alt = "HUDA Welfare & Educational Multipurpose Society";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#14532D",
          color: "#FAFAF7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 9999,
              border: "6px solid #FAFAF7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 28,
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>
              {settings.short_name}
            </div>
            <div style={{ fontSize: 20, letterSpacing: 3, color: "#DCFCE7" }}>
              WELFARE & EDUCATIONAL MULTIPURPOSE SOCIETY
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, fontWeight: 700, maxWidth: 1000, marginBottom: 16 }}>
            {settings.tagline}
          </div>
          <div style={{ fontSize: 24, color: "#DCFCE7" }}>
            {`${settings.city}, ${settings.state}`}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 12,
            background: "#C9A227",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
