import { Typography, Grid, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { UserCard } from "components/users";
import { useMode } from "contexts/ModeContext";

import sacMembers from "public/assets/json/sacMembers.json";
import slcMembers from "public/assets/json/slcMembers.json";
import sloMembers from "public/assets/json/sloMembers.json";

export default function About() {
    const theme = useTheme();
    const { isLight } = useMode();

    return (
        <Page title="About">
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
                    <Typography variant="h1" sx={{ fontWeight: 500, color: isLight ? "grey.700" : "grey.400" }}>
                        SAC - <i>Student Affairs Committee</i>
                    </Typography>
                </Box>

                {/* <Typography variant="h5" gutterBottom>
                    ABOUT
                </Typography>

                <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent facilisis velit pellentesque posuere euismod.
                    Morbi maximus lacus nec tincidunt dapibus. Nulla consectetur gravida velit ut consectetur.
                    Etiam vel euismod odio. Vestibulum vitae est at ante ultricies ultricies.
                    Maecenas arcu urna, sagittis ornare auctor et, mattis sed ex. Nulla dignissim accumsan.
                </Typography> */}
                {/* <Typography variant="body1" mt={1}>
                    The Clubs Council works closely with the institute&apos;s Students&apos; Life
                    Office, Finance Council, Outreach, IT Offices, SLC and SAC faculty members, and
                    all other student administrative bodies.
                </Typography>
                <Typography variant="body1" mt={1}>
                    The primary aim of the Clubs Council is to ensure that all student-driven
                    organizations on campus are successful in their aim to cultivate diverse campus
                    life experiences throughout the year, and enrich the thriving campus community
                    outside the classroom, while fostering inclusion.
                </Typography> */}

                <Typography variant="h5" gutterBottom mt={4}>
                    Members
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {sacMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>

                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mb: 2,
                        mt: 5,
                    }}
                >
                    <Typography variant="h1" sx={{ fontWeight: 500, color: isLight ? "grey.700" : "grey.400" }}>
                        SLC - <i>Student Life Committee</i>
                    </Typography>
                </Box>


                <Typography variant="h5" gutterBottom>
                    ABOUT
                </Typography>

                <Typography variant="body1">
                    Student Life Comittee is dedicated to enhancing the overall student experience and fostering a vibrant and inclusive campus community.
                    We believe that student life is an integral part of a well-rounded education, and we strive to create opportunities for personal growth,
                    leadership development, and meaningful connections among students.
                    <br /> <br />
                    Our committee consists of passionate student representatives who work closely with faculty, staff,
                    and the wider student body to organize and coordinate a wide range of events, programs, and initiatives.
                    From social gatherings and cultural celebrations to educational workshops and community service projects,
                    we aim to provide diverse opportunities for students to explore their interests, build lasting friendships,
                    and make a positive impact on campus.
                </Typography>

                <Typography variant="h5" gutterBottom mt={4}>
                    Members
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {slcMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>
                {/* Add two students - 1B and 1G */}

                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mb: 2,
                        mt: 5,
                    }}
                >
                    <Typography variant="h1" sx={{ fontWeight: 500, color: isLight ? "grey.700" : "grey.400" }}>
                        SLO - <i>Student Life Office</i>
                    </Typography>
                </Box>

                <Typography variant="h5" gutterBottom>
                    ABOUT
                </Typography>

                <Typography variant="body1">
                    Our mission is to enhance the overall student experience and promote a vibrant campus community.
                    We are dedicated to encouraging an equitable balance between academics and extra-curricular activities
                    for all students across campus and empowering students throughout their academic journey.
                    <br /> <br />
                    Student Life Office here to assist you and ensure that your time at our institution is
                    fulfilling, enjoyable, memorable and our friendly staff is ready to answer your questions
                    and provide the support you need. We understand that your time in college is about more than
                    just attending classes and studying; it&apos;s about discovering your passions and creating lasting memories.
                    That&apos;s why we offer a variety of programs and initiatives designed to enrich your student life experience.
                </Typography>

                <Typography variant="h5" gutterBottom mt={4}>
                    Members
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {sloMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>
            </Container>
        </Page>
    );
}
