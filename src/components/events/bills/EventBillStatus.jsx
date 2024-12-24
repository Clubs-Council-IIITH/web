import { Box, Grid, Typography, Divider } from "@mui/material";

import { billsStateLabel } from "utils/formatEvent";

export default async function EventBillStatus(event, eventBills) {
  if (
    event?.status?.state !== "approved" ||
    new Date(event?.datetimeperiod[1]) > new Date() ||
    event?.budget?.length === 0
  )
    return null;

  if (!eventBills) return null;

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
    </>
  );
}