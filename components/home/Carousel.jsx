import { Typography, Card, CardContent, Link } from "@mui/material";

import { alpha, styled } from "@mui/material/styles";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useResponsive from "hooks/useResponsive";
import { useMode } from "contexts/ModeContext";

import Image from "components/Image";

const StyledTitle = styled(Link)({
    overflow: "hidden",
    WebkitLineClamp: 2,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
});

export default function Carousel({ items }) {
    const { isLight } = useMode();
    
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
        <Card sx={{ position: "relative", boxShadow: `0px 5px 10px 0px ${isLight ? alpha("#000000", 0.5) : alpha("#504f58", 0.5)}` }}>
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

            <CardContent
                sx={{
                    px: isDesktop ? 4 : 2,
                    py: isDesktop ? 4 : 2,
                    bottom: 0,
                    width: "100%",
                    position: "absolute",
                }}
            >
                <StyledTitle
                    color="inherit"
                    variant="subtitle2"
                    underline="none"
                    sx={{
                        typography: isDesktop ? "h3" : "h4",
                        color: "common.white",
                    }}
                >
                    {title}
                </StyledTitle>

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
