// @mui
import { Container } from "@mui/material";

import Page from "components/Page";
import { Carousel, Upcoming, Details, Gallery, Footer } from "components/home";

import carouselItems from "public/assets/json/carouselItems.json";
import galleryItems from "public/assets/json/galleryItems.json";

export default function GeneralApp() {
    return (
        <Page title="Home">
            <Container maxWidth="xl">
                <Carousel items={carouselItems} />
                <Upcoming />
                <Details />
                <Gallery images={galleryItems} />
                <Footer />
            </Container>
        </Page>
    );
}
