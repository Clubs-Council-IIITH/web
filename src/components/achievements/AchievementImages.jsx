"use client";

import { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "./slick-theme.css"

import { getFile } from "utils/files";
import { getPlaceholder } from "utils/placeholder";

export default function AchievementImages({ achievement }) {
  const settings = {
    dots: true,
    arrows: true,
    lazyLoad: true,
    infinite: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  console.log("image:", achievement);

  // if no image links, render a placeholder image 
  if(!achievement.imageLinks?.length) {
    return (
      <Box
        sx={{
          position: "relative",
          pt: "80%",
        }}
      >
        <AchievementImage
          name={achievement.name}
          image={null}
          width={800}
          height={500}
        />
      </Box>
    );
  }

  return (
      <Slider {...settings}>
        {achievement.imageLinks.map((image) => (
          <Box
            key={image}
            sx={{
              position: "relative",
              pt: "80%",
            }}
          >
          <AchievementImage
            name={achievement.name}
            image={image}
            width={800}
            height={500}
          />
          </Box>
        ))}
      </Slider>
  );
}

export function AchievementImage({ name, image, width, height, style }) {
  const [img, setImg] = useState(
    image
      ? getFile(image)
      : getPlaceholder({ seed: name, w: width, h: height }),
  );

  return (
    <Image
      alt={name}
      src={img}
      width={width}
      height={height}
      style={{
        top: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        ...style,
      }}
      onError={() =>{
        setImg(getPlaceholder({ seed: name, w: width, h: height }))}
      }
      priority={true}
    />
  );
}