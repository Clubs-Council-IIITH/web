"use client";

import Image from "next/image";

import { useState, useEffect } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Typography, Card, CardContent, Link } from "@mui/material";

export default function Carousel({ items, sx }) {
  const settings = {
    dots: false,
    lazyLoad: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  return (
    <Card sx={sx}>
      <Slider {...settings}>
        {items.map((item, key) => (
          <CarouselItem key={key} item={item} />
        ))}
      </Slider>
    </Card>
  );
}

function CarouselItem({ item }) {
  const { image, title, description } = item;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [size, setSize] = useState("40%");
  useEffect(() => setSize(isDesktop ? "40%" : "120%"), [isDesktop]);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          pt: size,
          "&:after": {
            top: 0,
            content: "''",
            width: "100%",
            height: "100%",
            position: "absolute",
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
          },
        }}
      >
        <Image
          placeholder="blur"
          alt={title}
          src={image}
          fill={true}
          style={{
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
        />
      </Box>

      <CardContent
        sx={{
          px: isDesktop ? 4 : 2,
          py: isDesktop ? 4 : 2,
          bottom: 0,
          width: "100%",
          position: "absolute",
        }}
      >
        <Link
          color="inherit"
          variant="subtitle2"
          underline="none"
          sx={{
            overflow: "hidden",
            WebkitLineClamp: 2,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            typography: isDesktop ? "h3" : "h4",
            color: "common.white",
          }}
        >
          {title}
        </Link>

        <Typography
          gutterBottom
          variant={isDesktop ? "h6" : "body2"}
          fontWeight={400}
          sx={{ color: "common.white", display: "flex" }}
        >
          {description}
        </Typography>
      </CardContent>
    </>
  );
}
