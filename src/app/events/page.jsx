import { Box, Divider, Typography } from "@mui/material";
import EventsFilter from "components/events/EventsFilter";

import EventsGrid from "components/events/EventsGrid";

export const metadata = {
  title: "Events",
};

export default async function Events({ searchParams }) {
  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;
  const targetState = [
    ...(searchParams?.upcoming === "true" ? ["upcoming"] : []),
    ...(searchParams?.completed === "true" ? ["completed"] : []),
  ];

  const ongoingEventsFilter = (event) => {
    let selectedClub = false,
      selectedState = false,
      selectedName = false;

    // filter by club
    if (!targetClub) selectedClub = true;
    else selectedClub = event?.clubid === targetClub;

    // filter by state
    if (!targetState) selectedState = true;
    else {
      const isOngoing =
        new Date(event?.datetimeperiod[0]) <= new Date() &&
        new Date(event?.datetimeperiod[1]) >= new Date();
      selectedState = isOngoing;
    }

    // filter by name
    if (!targetName) selectedName = true;
    else
      selectedName = event?.name
        ?.toLowerCase()
        ?.includes(targetName?.toLowerCase());

    return selectedClub && selectedState && selectedName;
  };

  const upcomingEventsFilter = (event) => {
    let selectedClub = false,
      selectedState = false,
      selectedName = false;

    // filter by club
    if (!targetClub) selectedClub = true;
    else selectedClub = event?.clubid === targetClub;

    // filter by state
    if (!targetState) selectedState = true;
    else {
      const isUpcoming = new Date(event?.datetimeperiod[0]) > new Date();
      selectedState = isUpcoming;
    }

    // filter by name
    if (!targetName) selectedName = true;
    else
      selectedName = event?.name
        ?.toLowerCase()
        ?.includes(targetName?.toLowerCase());

    return selectedClub && selectedState && selectedName;
  };

  const completedEventsFilter = (event) => {
    let selectedClub = false,
      selectedState = false,
      selectedName = false;

    // filter by club
    if (!targetClub) selectedClub = true;
    else selectedClub = event?.clubid === targetClub;

    // filter by state
    if (!targetState) selectedState = true;
    else {
      const isOngoing = new Date(event?.datetimeperiod[1]) < new Date();
      selectedState = isOngoing;
    }

    // filter by name
    if (!targetName) selectedName = true;
    else
      selectedName = event?.name
        ?.toLowerCase()
        ?.includes(targetName?.toLowerCase());

    return selectedClub && selectedState && selectedName;
  };

  return (
    <Box>
      <Box mt={2}>
        <EventsFilter name={targetName} club={targetClub} state={targetState} />
      </Box>

      <>
        <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
          <Typography variant="h5" color="grey">
            Ongoing Events
          </Typography>
        </Divider>

        <EventsGrid type="all" filter={ongoingEventsFilter} />
      </>

      {targetState?.includes("upcoming") ? (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Upcoming Events
            </Typography>
          </Divider>

          <EventsGrid type="all" filter={upcomingEventsFilter} />
        </>
      ) : null}

      {targetState?.includes("completed") ? (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Completed Events
            </Typography>
          </Divider>

          <EventsGrid type="all" filter={completedEventsFilter} />
        </>
      ) : null}
    </Box>
  );
}
