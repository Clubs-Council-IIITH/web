import { Typography, Grid, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { UserCard } from "components/users";
import { useMode } from "contexts/ModeContext";

import ccMembers from "public/assets/json/ccMembers.json";
import extendedMembers from "public/assets/json/extendedMembers.json";
import techMembers from "public/assets/json/techMembers.json";
const CCMiniLogo = "/assets/vector/logo_mini_coloured.svg";

export default function About() {
    const theme = useTheme();
    const { isLight } = useMode();

    return (
        <Page title="Clubs Council">
            <Container>
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mb: 2,
                    }}
                >
                    <Image
                        priority
                        src={CCMiniLogo}
                        alt={"Clubs Council"}
                        width={0}
                        height={0}
                        style={{ width: "2.8rem", height: "3rem" }}
                    />
                    <Typography variant="h1" sx={{ fontWeight: 500, color: isLight ? "grey.700" : "grey.400" }}>
                        lubs
                    </Typography>
                    <Image
                        priority
                        src={CCMiniLogo}
                        alt={"Clubs Council"}
                        width={0}
                        height={0}
                        style={{ width: "2.8rem", height: "3rem", marginLeft: "1rem" }}
                    />
                    <Typography variant="h1" sx={{ fontWeight: 500, color: isLight ? "grey.700" : "grey.400" }}>
                        ouncil
                    </Typography>
                </Box>


                <Typography variant="h5" gutterBottom>
                    What do we do?
                </Typography>

                <Typography variant="body1">
                    As a constituent body of the <i>Students&apos; Life Committee</i> (SLC), the
                    Clubs Council oversees all the student-driven activities and the functioning of
                    the clubs. It handles the annual budget of clubs, events, coordinates among
                    different clubs and helps in creating new clubs, societies and special interest
                    groups.
                </Typography>
                <Typography variant="body1" mt={1}>
                    The Clubs Council works closely with the institute&apos;s Students&apos; Life
                    Office, Finance Council, Outreach, IT Offices, SLC and SAC faculty members, and
                    all other student administrative bodies.
                </Typography>
                <Typography variant="body1" mt={1}>
                    The primary aim of the Clubs Council is to ensure that all student-driven
                    organizations on campus are successful in their aim to cultivate diverse campus
                    life experiences throughout the year, and enrich the thriving campus community
                    outside the classroom, while fostering inclusion.
                </Typography>

                <Typography variant="h5" gutterBottom mt={4}>
                    Executive Board
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {ccMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>

                <Typography variant="h5" gutterBottom mt={4}>
                    Tech Team
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {techMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>

                <Typography variant="h5" gutterBottom mt={4}>
                    Extended Team
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {extendedMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>

                <Typography variant="h5" gutterBottom mt={5}>
                    The Clubs Council Team
                </Typography>

                <Typography variant="body1">
                    The Club Coordinators are an essential part of the Clubs Council, and they come
                    together to collaboratively organise and provide an extraordinary range of
                    opportunities through the form of various events, enabling students to pursue
                    their hobbies and develop their extra-curricular skills.
                </Typography>
                <Typography variant="body1" mt={1}>
                    And then come the Club Members, who play an important role in design,
                    development and execution of any event organised by the clubs, and contribute to
                    the betterment of Students&apos; Life at IIIT, Hyderabad.
                </Typography>
            </Container>
        </Page>
    );
}
