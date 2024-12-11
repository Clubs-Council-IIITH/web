import { getClient } from "gql/client";
import Link from "next/link";
import Icon from "components/Icon";
import { GET_EVENT_BILLS_STATUS } from "gql/queries/events";

import { Box, Button, Grid, Typography, Divider, Stack } from "@mui/material";

import { billsStateLabel } from "utils/formatEvent";

export default async function EventBillStatus(event) {
  if (
    event?.status?.state !== "approved" ||
    new Date(event?.datetimeperiod[1]) > new Date() ||
    event?.budget?.length === 0
  )
    return null;

  const { data, error } = await getClient().query(GET_EVENT_BILLS_STATUS, {
    eventid: event._id,
  });

  if (error || !data) return null;

  const eventBills = data?.eventBills;

  return (
    <>
      <Divider sx={{ borderStyle: "dashed", my: 2 }} />
      <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
        Financial Information
      </Typography>

      <Grid container spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box mt={2}>Bills Status</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box mt={2}>-</Box>
          </Grid>
          <Grid item xs>
            <Box mt={2}>
              {eventBills?.state == null
                ? "Information not available"
                : billsStateLabel(eventBills?.state)?.name}
            </Box>
          </Grid>
        </Grid>

        {eventBills?.state != null ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box mt={0}>Last Updated</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box mt={0}>-</Box>
              </Grid>
              <Grid item xs>
                <Box mt={0}>
                  {eventBills?.updatedTime == null
                    ? "Information not available"
                    : eventBills?.updatedTime}
                </Box>
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box mt={0}>SLO Comment</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box mt={0}>-</Box>
              </Grid>
              <Grid item xs>
                <Box mt={0}>
                  {eventBills?.sloComment == null
                    ? "-"
                    : eventBills?.sloComment}
                </Box>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>

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
