// @mui
import { Typography, Button, Box, Grid, Card, Container } from "@mui/material";

// components
import Page from "components/Page";
import { UserCard } from "components/users";

import ccMembers from "public/assets/json/ccMembers.json";

export default function About() {
    return (
        <Page title="About">
            <Container>
                <Typography variant="h5" gutterBottom>
                    What do we do?
                </Typography>

                <Typography variant="body1">
                    As a constituent body of the <i>Students&apos; Life Committee</i> (SLC), the
                    Clubs Council oversees all the student-driven activities and the functioning of
                    the clubs. It handles the annual budget of clubs, events, coordinates among
                    different clubs and helps in creating new clubs, societies and special interest
                    groups.
                    <Box mt={1} />
                    The Clubs Council works closely with the institute&apos;s Students&apos; Life
                    Office, Finance Council, Outreach, IT Offices, SLC and SAC faculty members, and
                    all other student administrative bodies.
                    <Box mt={1} />
                    The primary aim of the Clubs Council is to ensure that all student-driven
                    organizations on campus are successful in their aim to cultivate diverse campus
                    life experiences throughout the year, and enrich the thriving campus community
                    outside the classroom, while fostering inclusion.
                </Typography>

                <Typography variant="h5" gutterBottom mt={4}>
                    Executive Board
                </Typography>

                <Grid container spacing={3}>
                    {ccMembers.map((user) => (
                        <Grid key={user.id} item xs={12} sm={6} md={3}>
                            <UserCard user={user} />
                        </Grid>
                    ))}
                </Grid>

                <Typography variant="h5" gutterBottom mt={5}>
                    The Clubs Council Team
                </Typography>

                <Typography variant="body1">
                    The Club Coordinators are an essential part of the Clubs Council, and they come
                    together to collaboratively organise and provide an extraordinary range of
                    opportunities through the form of various events, enabling students to pursue
                    their hobbies and develop their extra-curricular skills.
                    <Box mt={1} />
                    And then come the Club Members, who play an important role in design,
                    development and execution of any event organised by the clubs, and contribute to
                    the betterment of Students&apos; Life at IIIT, Hyderabad.
                </Typography>
            </Container>
        </Page>
    );
}
