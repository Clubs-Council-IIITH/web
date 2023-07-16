import { Box, Typography } from "@mui/material";

import EventsGrid from "components/events/EventsGrid";

export const metadata = {
  title: "Events",
};

export default async function Events() {
  return (
    <Box>
      <EventsGrid type="all" />
    </Box>
  );
}
