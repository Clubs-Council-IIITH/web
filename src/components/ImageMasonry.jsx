"use client";

import Link from "next/link";
import Image from "next/image";

import { Card, CardActionArea, ImageList, ImageListItem } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ImageMasonry({ images, linkPrefix }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <ImageList variant="masonry" cols={isDesktop ? 4 : 2} gap={10}>
      {images.map((url, id) => (
        <ImageListItem key={id}>
          <Card
            variant="outlined"
            component="div"
            sx={{
              lineHeight: 0,
              display: "block",
              overflow: "hidden",
              "& .wrapper": {
                width: 1,
                height: 1,
                backgroundSize: "cover !important",
              },
            }}
          >
            <CardActionArea
              component={Link}
              shallow
              href={`${linkPrefix}${id}`}
            >
              <Image
                src={url}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "100%" }}
              />
            </CardActionArea>
          </Card>
        </ImageListItem>
      ))}
    </ImageList>
  );
}
