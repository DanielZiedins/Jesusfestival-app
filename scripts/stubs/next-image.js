import React from "react";
export default function Image(props) {
  const { src, ...rest } = props;
  for (const key of ["fill", "preload", "sizes", "priority", "quality", "placeholder", "blurDataURL"]) delete rest[key];
  return React.createElement("img", { ...rest, src: typeof src === "string" ? src : "stub.jpg" });
}
