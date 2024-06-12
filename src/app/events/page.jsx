import { Box, Divider, Typography } from "@mui/material";
import EventsFilter from "components/events/EventsFilter";

import EventsGrid from "components/events/EventsGrid";
import {getDateObj} from "utils/formatTime";

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

  return (
    <Box>
      <Box mt={2}>
        <EventsFilter name={targetName} club={targetClub} state={targetState} />
      </Box>

      {targetState?.includes("upcoming") ? (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Upcoming Events
            </Typography>
          </Divider>

          <EventsGrid
            type="all"
            filter={(event) => {
              let selectedClub = false,
                selectedState = false,
                selectedName = false;

              // filter by club
              if (!targetClub) selectedClub = true;
              else selectedClub = event?.clubid === targetClub;

              // filter by state
              if (!targetState) selectedState = true;
              else {
                const isUpcoming =
                  new getDateObj(event?.endTime) > new Date();
                selectedState = isUpcoming;
              }

              // filter by name
              if (!targetName) selectedName = true;
              else
                selectedName = event?.name
                  ?.toLowerCase()
                  ?.includes(targetName?.toLowerCase());

              return selectedClub && selectedState && selectedName;
            }}
          />
        </>
      ) : null}

      {targetState?.includes("completed") ? (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Completed Events
            </Typography>
          </Divider>

          <EventsGrid
            type="all"
            filter={(event) => {
              let selectedClub = false,
                selectedState = false,
                selectedName = false;

              // filter by club
              if (!targetClub) selectedClub = true;
              else selectedClub = event?.clubid === targetClub;

              // filter by state
              if (!targetState) selectedState = true;
              else {
                const isUpcoming =
                  new getDateObj(event?.endTime) > new Date();
                selectedState = !isUpcoming;
              }

              // filter by name
              if (!targetName) selectedName = true;
              else
                selectedName = event?.name
                  ?.toLowerCase()
                  ?.includes(targetName?.toLowerCase());

              return selectedClub && selectedState && selectedName;
            }}
          />
        </>
      ) : null}
    </Box>
  );
}
