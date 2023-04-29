import { Typography, Card, CardContent, Link } from "@mui/material";

import { alpha, styled } from "@mui/material/styles";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// hooks
import useResponsive from "hooks/useResponsive";

import Image from "components/Image";

const StyledTitle = styled(Link)({
    overflow: "hidden",
    WebkitLineClamp: 2,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
});

export default function Carousel({ items }) {
    const settings = {
        dots: false,
        lazyLoad: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    return (
        <Card sx={{ position: "relative" }}>
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
    const isDesktop = useResponsive("up", "sm");

    return (
        <>
            <Image
                priority
                src={image}
                alt={title}
                ratio={isDesktop ? "21/9" : "3/4"}
                sx={{
                    "&:after": {
                        top: 0,
                        content: "''",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
                    },
                }}
            />

            <CardContent sx={{ px: 4, py: 4, bottom: 0, width: "100%", position: "absolute" }}>
                <StyledTitle
                    color="inherit"
                    variant="subtitle2"
                    underline="none"
                    sx={{
                        typography: "h3",
                        color: "common.white",
                    }}
                >
                    {title}
                </StyledTitle>

                <Typography
                    gutterBottom
                    variant="h6"
                    fontWeight={400}
                    sx={{ color: "common.white", display: "block" }}
                >
                    {description}
                </Typography>
            </CardContent>
        </>
    );
}
