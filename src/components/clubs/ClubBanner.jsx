"use client";

import { useState } from "react";

import Image from "next/image";

import { getFile } from "utils/files";
import { getPlaceholder } from "utils/placeholder";

export default function ClubBanner({ name, banner, width, height, style }) {
  const [img, setImg] = useState(
    banner
      ? getFile(banner)
      : getPlaceholder({ seed: name, w: width, h: height })
  );

  return (
    <Image
      alt={name}
      src={img}
      width={width}
      height={height}
      style={style}
      onError={() =>
        setImg(getPlaceholder({ seed: name, w: width, h: height }))
      }
    />
  );
}
