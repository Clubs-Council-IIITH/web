import { Box, Grid, Typography } from "@mui/material";
import Statistic from "components/Statistic";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
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
    </Box>
  );
}
