import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default async function EventsGrid({
  type = "all", // must be one of: {recent, club, all}
  limit = undefined,
  events = null,
  loading = false,
}) {

  return (
    <Grid container spacing={2}>
      {events?.length ? (
        events?.map((event) => (
            <Grid key={event._id} item xs={6} md={4} lg={3}>
              <EventCard
                _id={event._id}
                name={event.name}
                datetimeperiod={event.datetimeperiod}
                poster={event.poster || event.clubbanner}
                clubid={event.clubid}
                blur={event.poster ? 0 : 0.3}
              />
            </Grid>
          ))
      ) : (
        <Typography
          variant="h4"
          color="text.secondary"
          sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
        >
          {loading ? "Loading..." : "No events found."}
        </Typography>
      )}
    </Grid>
  );
}