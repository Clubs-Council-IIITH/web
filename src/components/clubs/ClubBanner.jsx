"use client";

import { useState } from "react";

import Image from "next/image";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { getFile } from "utils/files";
import { getPlaceholder } from "utils/placeholder";

export default function ClubBanner({
  name,
  banner,
  logo = null,
  width,
  height,
  containerHeight = null,
  dim = false,
  imageProps = {},
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [img, setImg] = useState(
    banner
      ? getFile(banner)
      : getPlaceholder({ seed: name, w: width, h: height }),
  );

  return (
    <Box
      sx={{
        position: "relative",
        pt: containerHeight ? containerHeight : isDesktop ? "400px" : "200px",
        "&:after": {
          top: 0,
          content: "''",
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundImage: dim ? "linear-gradient(transparent, #111)" : "none",
        },
      }}
    >
      <Image
        alt={name}
        src={img}
        width={width + 300}
        height={height + 300}
        style={{
          top: 0,
          width: "100%",
          height: "100%",
          objectFit: isDesktop ? "stretch" : "cover",
          position: "absolute",
          opacity: logo && theme.palette.mode !== "dark" ? 0.07 : 0.7,
          backgroundColor: theme.palette.background.default,
        }}
        onError={() =>
          setImg(getPlaceholder({ seed: name, w: width, h: height }))
        }
        {...imageProps}
      />
      {logo ? (
        <Image
          alt={name}
          src={logo}
          layout="fill"
          objectFit="contain"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: theme.spacing(3.5),
          }}
        />
      ) : null}
    </Box>
  );
}

export function ClubBannerImg() {}
