import React from "react";
export default function Image(props) {
  const { fill, preload, sizes, priority, quality, placeholder, blurDataURL, ...rest } = props;
  return React.createElement("img", { ...rest, src: typeof props.src === "string" ? props.src : "stub.jpg" });
}
