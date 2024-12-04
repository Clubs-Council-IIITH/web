"use client";

import Image from "next/image";

import { useTheme } from "@mui/material/styles";

const LifeLogoPath = "/assets/life-logo-full-color-light.svg";

export default function LifeLogo({ height, width }) {
  const theme = useTheme();

  return (
    <Image
      src={LifeLogoPath}
      alt={"Life Logo"}
      height={height}
      width={width}
      style={{
        filter: theme.palette.mode == "light" ? "none" : "invert(100%)",
      }}
    />
  );
}
