"use client";

import { useState } from "react";
import Image from "next/image";

import { Card, CardActionArea, ImageList, ImageListItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import ImageModal from "components/ImageModal";
import { useMode } from "contexts/ModeContext";

export default function ImageMasonry({ images, limit = undefined, cols = 4 }) {
  const theme = useTheme();
  const { isDark } = useMode();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [openImage, setOpenImage] = useState(null);

  return (
    <>
      <ImageList variant="masonry" cols={isDesktop ? cols : 2} gap={10}>
        {images.slice(0, limit).map((url, id) => (
          <ImageListItem key={id}>
            <Card
              variant="outlined"
              component="div"
              sx={{
                lineHeight: 0,
                display: "block",
                overflow: "hidden",
                boxShadow: `0px 4px 6px ${theme.palette.primary.dark}80`,
                "& .wrapper": {
                  width: 1,
                  height: 1,
                  backgroundSize: "cover !important",
                },
                margin: "1%",
              }}
            >
              <CardActionArea
                onClick={() => {
                  setOpenImage(id);
                }}
                sx={{ lineHeight: 0 }}
              >
                {showImage(url, id, isDark)}
              </CardActionArea>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
      <ImageModal
        images={images}
        id={openImage}
        onClose={() => setOpenImage(null)}
      />
    </>
  );
}

function showImage(url, id, isDark = true) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={
        isLoaded
          ? url
          : `data:image/svg+xml;base64,${toBase64(shimmer(700, 475, isDark))}`
      }
      width={0}
      height={0}
      sizes="100vw"
      alt={`Gallery Image ${id}`}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "100vh",
        maxWidth: "100vw",
      }}
      placeholder={`data:image/svg+xml;base64,${toBase64(
        shimmer(700, 475, isDark)
      )}`}
      priority={!isLoaded}
      onLoad={() => setIsLoaded(true)}
    />
  );
}

const shimmer = (w, h, isDark) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="${isDark ? "#333" : "#ccc"}" offset="20%" />
      <stop stop-color="${isDark ? "#333" : "#bbb"}" offset="50%" />
      <stop stop-color="${isDark ? "#333" : "#ccc"}" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${isDark ? "#333" : "#ccc"}" />
  <rect id="r" width="${w}" height="${h}" fill="${isDark ? "black" : "white"}"/>
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
