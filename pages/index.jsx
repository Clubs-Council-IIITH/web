import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Container } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import Page from "components/Page";
import { Carousel, Upcoming, Details, Gallery, Footer } from "components/home";

import carouselItems from "public/assets/json/carouselItems.json";
import galleryItems from "public/assets/json/galleryItems.json";

export default function GeneralApp() {
  const router = useRouter();
  const confirm = useConfirm();
  const [displayPopUp, setDisplayPopUp] = useState(false);

  const environment = process.env.NODE_ENV;
  // development, test, production

  useEffect(() => {
    let returningUser = sessionStorage.getItem("seenPopUpCCTestWebsite");
    if (returningUser == "false" || returningUser == null)
      returningUser = false;
    else
      returningUser = true;
    setDisplayPopUp(!returningUser);
  }, []);

  useEffect(() => {
    if (environment !== 'test') {
      setDisplayPopUp(false);
    }
    if (environment && environment === 'test' && displayPopUp) {
      console.log(environment);
      confirm({
        title: "Testing Website",
        description: "This is a testing website. Do you want to go to the public website? (https://clubs.iiit.ac.in)",
        confirmationText: "Yes",
      })
        .then(() => {
          sessionStorage.setItem("seenPopUpCCTestWebsite", true);
          router.push('https://clubs.iiit.ac.in');
        })
        .catch(() => {
          // nothing
        });

      setDisplayPopUp(false);
    }
  }, [displayPopUp]);

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
