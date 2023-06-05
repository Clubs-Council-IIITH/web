// @mui
import { Typography, Button, Box, Grid } from "@mui/material";

// components
import Statistic from "components/Statistic";

export default function Details() {
    const stats = {
        n_technical_clubs: 7,
        n_cultural_clubs: 16,
        n_student_constitutent_groups: 23,
        n_student_coordinators: 70,
        n_organizing_team_members: 350,
    };

    return (
        <Box mt={5}>
            <Typography variant="h3" sx={{ mb: 2 }}>
                Clubs @ IIITH
            </Typography>

            <Typography variant="body">
                The clubs of IIIT-H conduct various captivating events throughout the year. Students
                across all UG/PG batches engage in the events, which tells how lively the campus
                life is! The 23 clubs at IIITH are divided into technical and cultural categories.
                <Box my={2} />
                Clubs on campus are run by students, for the students. Club activities help develop
                new hobbies and interests in students and thereby contributing to the all around
                development of the students.
            </Typography>

            <Box my={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Statistic
                            color="info"
                            icon="grommet-icons:technology"
                            total={stats.n_technical_clubs}
                            title="Technical Clubs"
                            sx={{ height: 200, p: 3 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Statistic
                            color="warning"
                            icon="akar-icons:heart"
                            total={stats.n_cultural_clubs}
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
                The Clubs Council is the largest Student Administrative Organization at IIIT
                Hyderabad, and acts as an umbrella body of all the institute affiliated and
                associate student-led Clubs, Groups & Societies.
            </Typography>

            <Box my={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Statistic
                            color="success"
                            icon="ic:outline-groups-3"
                            total={stats.n_student_constitutent_groups + "+"}
                            title="Student Constituent Groups"
                            sx={{ height: 200, p: 3 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Statistic
                            color="error"
                            icon="icons8:student"
                            total={stats.n_student_coordinators + "+"}
                            title="Student Coordinators"
                            sx={{ height: 200, p: 3 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Statistic
                            color="primary"
                            icon="carbon:plan"
                            total={stats.n_organizing_team_members + "+"}
                            title="Organizing Team Members"
                            sx={{ height: 200, p: 3 }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
