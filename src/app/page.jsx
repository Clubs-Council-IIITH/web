import Link from "next/link";

import { Box, Grid, Typography, Stack, Button } from "@mui/material";
import Carousel from "components/Carousel";

import EventsGrid from "components/events/EventsGrid";
import Statistic from "components/Statistic";
import Icon from "components/Icon";

// carousel images
import carousel1 from "/public/assets/img/carousel/1.jpg";
import carousel2 from "/public/assets/img/carousel/2.jpg";
import carousel3 from "/public/assets/img/carousel/3.jpg";
import carousel4 from "/public/assets/img/carousel/4.jpg";
import carousel5 from "/public/assets/img/carousel/5.jpg";
import carousel6 from "/public/assets/img/carousel/6.jpg";
import carousel7 from "/public/assets/img/carousel/7.jpg";
import carousel8 from "/public/assets/img/carousel/8.jpg";
import carousel9 from "/public/assets/img/carousel/9.jpg";
import carousel12 from "/public/assets/img/carousel/12.jpg";
import Gallery from "./gallery/page";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <Box>
      <Carousel items={carouselItems} sx={{ mb: 3 }} />

      <Stack direction="row" pt={2} mb={2}>
        <Typography variant="h4">Upcoming & Recent Events</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box display="flex" alignItems="center">
          <Button
            variant="none"
            color="secondary"
            component={Link}
            href="/events?upcoming=true&completed=true"
          >
            <Typography variant="button" color="text.primary">
              View all
            </Typography>
            <Icon variant="chevron-right" />
          </Button>
        </Box>
      </Stack>
      <EventsGrid type="recent" limit={4} /> {/*TODO: Update this as events grid no longer fetches data*/}

      <Typography variant="h3" sx={{ mb: 2, mt: 4 }}>
        Clubs @ IIITH
      </Typography>

      <Typography variant="body">
        The clubs of IIIT-H conduct various captivating events throughout the
        year. Students across all UG/PG batches engage in the events, which
        tells how lively the campus life is! The 23 clubs at IIITH are divided
        into technical and cultural categories.
        <Box my={2} />
        Clubs on campus are run by students, for the students. Club activities
        help develop new hobbies and interests in students and thereby
        contributing to the all around development of the students.
      </Typography>

      <Box my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Statistic
              color="info"
              icon="component-exchange"
              total={7}
              title="Technical Clubs"
              sx={{ height: 200, p: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Statistic
              color="warning"
              icon="music-note-rounded"
              total={16}
              title="Cultural Clubs"
              sx={{ height: 200, p: 3 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Clubs Council @ IIITH
      </Typography>

      <Typography variant="body">
        The Clubs Council is the largest Student Administrative Organization at
        IIIT Hyderabad, and acts as an umbrella body of all the institute
        affiliated and associate student-led Clubs, Groups & Societies.
      </Typography>

      <Box my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Statistic
              color="success"
              icon="groups-3-outline-rounded"
              total={23 + "+"}
              title="Student Constituent Groups"
              sx={{ height: 200, p: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Statistic
              color="error"
              icon="school-outline-rounded"
              total={70 + "+"}
              title="Student Coordinators"
              sx={{ height: 200, p: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Statistic
              color="primary"
              icon="map-outline-rounded"
              total={350 + "+"}
              title="Organizing Team Members"
              sx={{ height: 200, p: 3 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box my={3}>
        <Stack direction="row" pt={2}>
          <Typography variant="h4">Gallery</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" alignItems="center">
            <Button
              variant="none"
              color="secondary"
              component={Link}
              href={"/gallery"}
            >
              <Typography variant="button" color="text.primary">
                View more
              </Typography>
              <Icon variant="chevron-right" />
            </Button>
          </Box>
        </Stack>
        <Gallery limit={8} />
      </Box>
    </Box>
  );
}

const carouselItems = [
  {
    image: carousel1,
    title: "Life at IIIT",
    description: "Eat. Sleep. Code? Not Quite.",
  },
  {
    image: carousel2,
    title: "Clubs at IIIT",
    description: "Explore your student life beyond the classroom.",
  },
  {
    image: carousel3,
    title: "Unrestricted Fun!",
    description: "Join in on fun events!",
  },
  {
    image: carousel4,
    title: "Connect IIIT",
    description: "Come together to learn, work, live and play.",
  },
  {
    image: carousel5,
    title: "Success Stories",
    description: "Witness legends in the making.",
  },
  {
    image: carousel6,
    title: "Experience IIIT",
    description: "Expand your mind, explore your passion.",
  },
  {
    image: carousel7,
    title: "Challengers",
    description: "Up the potential for fun.",
  },
  {
    image: carousel8,
    title: "Perform Together",
    description: "Let the beat take over.",
  },
  {
    image: carousel9,
    title: "Artistry",
    description: "Unleash your creativity.",
  },
  {
    image: carousel12,
    title: "Campus Life",
    description: "A vibrant residential community.",
  },
];
