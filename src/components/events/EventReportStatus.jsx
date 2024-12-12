import Link from "next/link";
import Icon from "components/Icon";

import { Box, Button, Typography, Stack, Divider } from "@mui/material";

export default async function EventReportStatus(event) {
  if(!event || event?.status?.state !== "approved" || new Date(event?.datetimeperiod[1]) > new Date()){
    return null
  }
  return (
    <>

  <Divider sx={{ borderStyle: "dashed", my: 2 }} />
  <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
    Event Report
  </Typography>
  {!event.eventReportSubmitted ? (
    <Box mt={2} display={"flex"} flexDirection={"column"}>
      No event report submitted.
      <Button
        component={Link}
        href={`/manage/events/${event._id}/report/new`}
        variant="contained"
        color="primary"
        startIcon={<Icon variant="add" />}
        sx={{ mt: 2, width: "max-content" }}
      >
        Add Report
      </Button>
    </Box>
  ) : (
    <Box mt={2}>
      <Typography>Report submitted</Typography>
      <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
        <Button
          component={Link}
          href={`/manage/events/${event._id}/report`}
          variant="contained"
          color="success"
          startIcon={<Icon variant="visibility-outline" />}
          sx={{ width: "max-content" }}
        >
          View Report
        </Button>
      </Stack>

    </Box>
  )}
    </>
  );
}