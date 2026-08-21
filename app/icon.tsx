import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon 64x64: monograma "Y" verde sobre carbón. */
export default function Icon() {
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
          fontSize: 44,
          fontWeight: 800,
          borderRadius: 12,
        }}
      >
        Y
      </div>
    ),
    size,
  );
}
