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
import { SettingsEthernet } from "@mui/icons-material";

export default function ImageMasonry({ images, limit = undefined, cols = 4 }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [openImage, setOpenImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = limit ? Math.min(images.length, limit) : images.length;
 

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };
  const print_images=(images)=>{
    console.log(images)
  }
  useEffect(()=>{
    if(loadedImages<totalImages){
      const timer = setTimeout(()=>{
        setLoadedImages((prev)=>Math.min(prev+20, totalImages));
        
      }, 1000);


    }
  }, [loadedImages, totalImages]);


  return (
    <>
    
    
      { (
        <ImageList variant="masonry" cols={isDesktop ? cols : 2} gap={10}>
          {images.slice(0, totalImages).map((url, id) => {d
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
                      print_images(images);
                    }}
                    sx={{ lineHeight: 0 }}
                  >
                    <Image
                      src={url.url}
                      width={url.width|0}
                      height={url.height|0}
                      sizes="100vw"
                      loading={id < loadedImages?"eager":"lazy"}
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
      )}

      <ImageModal
        images={images}
        id={openImage}
        onClose={() => setOpenImage(null)}
      />
    
    </>
  );
}
