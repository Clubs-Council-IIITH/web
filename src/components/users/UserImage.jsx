"use client";

import { useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Box, Avatar } from "@mui/material";

import { getFile } from "utils/files";
import { getPlaceholder } from "utils/placeholder";

const GenAvatar = dynamic(async () => await import("react-nice-avatar"), {
  ssr: false,
});
import { genConfig } from "react-nice-avatar";

export default function UserImage({
  image,
  name,
  gender,
  width,
  height,
  style = {},
}) {
  const [img, setImg] = useState(getFile(image));

  return img ? (
    <Avatar
      alt={name}
      sx={{
        width: width,
        height: height,
      }}
    >
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
    </Avatar>
  ) : (
    <GenAvatar
      style={{
        width: "8rem",
        height: "8rem",
      }}
      {...genConfig({
        sex: gender?.toLowerCase() === "male" ? "man" : "woman",
      })}
    />
  );
}
