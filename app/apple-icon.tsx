import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** apple-touch-icon 180x180. */
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
          backgroundColor: "#101820",
          color: "#2EC486",
          fontSize: 118,
          fontWeight: 800,
        }}
      >
        Y
      </div>
    ),
    size,
  );
}
