"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Box,
  Card,
  CardActionArea,
  Grid,
  ImageList,
  ImageListItem,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ImageModal from "components/ImageModal";

export default function ImageMasonry({ images, limit = undefined, cols = 4 }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [openImage, setOpenImage] = useState(null);

  const totalImages = limit ? Math.min(images.length, limit) : images.length;

  return (
    <>
      {
        <ImageList variant="masonry" cols={isDesktop ? cols : 2} gap={10}>
          {images.slice(0, totalImages).map((item, id) => {
            d;
            return (
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
                    <Image
                      src={item.url}
                      width={item.width | 0}
                      height={item.height | 0}
                      sizes="100vw"
                      preload={id == 1 ? true : false}
                      loading={id == 1 ? "eager" : "lazy"}
                      alt={`Gallery Image ${id}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "100vh",
                        maxWidth: "100vw",
                      }}
                    />
                  </CardActionArea>
                </Card>
              </ImageListItem>
            );
          })}
        </ImageList>
      }

      <ImageModal
        images={images}
        id={openImage}
        onClose={() => setOpenImage(null)}
      />
    </>
  );
}
