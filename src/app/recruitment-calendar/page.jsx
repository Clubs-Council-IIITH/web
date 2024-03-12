import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ClubButton from "components/clubs/ClubButton";

import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Recruitment Schedule",
};

export default async function RecruitmentSchedule() {
  const recruitmentSchedule = await fetch(
    getStaticFile("json/recruitmentCalendar.json"),
    {
      next: { revalidate: 120 },
    },
  );

  let recruitmentScheduleJSON = await recruitmentSchedule.json();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Box>
      <center>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Clubs Recruitment Calendar
        </Typography>
      </center>

      <Grid container spacing={2}>
        {months.map((month) => (
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <RecruitmentCard
              clubs={recruitmentScheduleJSON.filter(
                (val) => val.month === month.toLowerCase(),
              )}
              month={month}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function RecruitmentCard({ clubs, month = "January" }) {
  return (
    <Card variant="outlined" sx={{ position: "relative" }}>
      <CardHeader
        title={month}
        titleTypographyProps={{ textAlign: "center", mb: 2 }}
        sx={{ backgroundColor: "#1EC3BD" }}
      />
      <CardContent>
        {clubs?.map((club) => (
          <Box sx={{ mb: 1 }}>
            {/* <ArrowForwardIosIcon sx={{ float: 'left', mt: 0.5, mr: 5, ml: 1, mb: 0.5 }} /> */}
            <ClubButton clubid={club.cid} />
          </Box>
        ))}
        {clubs.length === 0 && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            No clubs are recruiting this month.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
