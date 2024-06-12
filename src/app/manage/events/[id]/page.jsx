import { getClient } from "gql/client";
import { GET_FULL_EVENT } from "gql/queries/events";
import { GET_USER } from "gql/queries/auth";

import {
  Box,
  Chip,
  Grid,
  Typography,
  Divider,
  CardActionArea,
} from "@mui/material";
import { Link } from "next/link";
import { redirect } from "next/navigation";
import ActionPalette from "components/ActionPalette";

import EventDetails from "components/events/EventDetails";
import EventBudget from "components/events/EventBudget";
import {
  EditEvent,
  CopyEvent,
  ApproveEvent,
  DeleteEvent,
  SubmitEvent,
} from "components/events/EventActions";
import {
  EventStatus,
  BudgetStatus,
  VenueStatus,
} from "components/events/EventStates";

import { locationLabel } from "utils/formatEvent";
import MemberListItem from "components/members/MemberListItem";

import {getDateObj} from "utils/formatTime"

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });

    return {
      title: event.name,
    };
  } catch (error) {
    redirect("/404");
  }
}

function approvalStatus(status) {
  return (
    <>
      <Divider sx={{ borderStyle: "dashed", my: 2 }} />
      <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
        Approvals
      </Typography>

      <Grid container spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box mt={2}>Event Submission</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box mt={2}>-</Box>
          </Grid>
          <Grid item xs>
            <Box mt={2}>
              {status?.submissionTime == null
                ? "Information not available"
                : (status?.submissionTime.includes(":")
                    ? "Submitted for approval on "
                    : "") + status?.submissionTime}
            </Box>
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box mt={1}>Clubs Council</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box mt={1}>-</Box>
          </Grid>
          <Grid item xs>
            <Box mt={1}>
              {status?.ccApproverTime == null
                ? "Information not available"
                : (status?.ccApproverTime.includes(":") ? "Approved on " : "") +
                  status?.ccApproverTime}
            </Box>
          </Grid>
        </Grid>
        {/* 
      <Grid container item spacing={2}>
        <Grid item xs={5} lg={3}>
          <Box mt={1}>Students Life Council</Box>
        </Grid>
        <Grid item xs={1} lg={0.1}>
          <Box mt={1}>-</Box>
        </Grid>
        <Grid item xs>
          <Box mt={1}>
            {status?.slcApproverTime == null
              ? "Information not available"
              : (status?.slcApproverTime.includes(":") ? "Approved on " : "") +
                status?.slcApproverTime}
          </Box>
        </Grid>
      </Grid>
      */}
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box mt={1}>Students Life Office</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box mt={1}>-</Box>
          </Grid>
          <Grid item xs>
            <Box mt={1}>
              {status?.sloApproverTime == null
                ? "Information not available"
                : (status?.sloApproverTime.includes(":")
                    ? "Approved on "
                    : "") + status?.sloApproverTime}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default async function ManageEvent({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
    eventid: id,
  });

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  return (
    user?.role === "club" && user?.uid !== event.clubid && redirect("/404"),
    (
      <Box>
        <ActionPalette
          left={[EventStatus, VenueStatus]}
          leftProps={[
            { status: event?.status },
            { status: event?.status, budget: event?.budget },
            { status: event?.status, location: event?.location },
          ]}
          right={getActions(event, { ...userMeta, ...userProfile })}
        />
        <EventDetails showCode event={event} />
        <Divider sx={{ borderStyle: "dashed", my: 2 }} />
        <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
          Point of Contact
        </Typography>
        <CardActionArea
          component={Link}
          href={`/profile/${event?.poc}`}
          sx={{ textDecoration: "none", maxWidth: "max-content" }}
        >
          <MemberListItem uid={event?.poc} />
        </CardActionArea>
        <Box my={3} />
        <Grid container spacing={6}>
          <Grid item xs={12} lg={7}>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              gutterBottom
            >
              Budget
            </Typography>
            {event?.budget?.length ? (
              <EventBudget
                rows={event?.budget?.map((b, key) => ({
                  ...b,
                  id: b?.id || key,
                }))} // add ID to each budget item if it doesn't exist (MUI requirement)
                editable={false}
              />
            ) : (
              <Box mt={2}>None requested</Box>
            )}
          </Grid>
          <Grid item xs lg>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              gutterBottom
            >
              Venue
            </Typography>

            {/* show requested location details, if any */}
            {event?.location?.length ? (
              <>
                <Box mt={2}>
                  {event?.location?.map((venue, key) => (
                    <Chip
                      key={key}
                      label={locationLabel(venue)?.name}
                      sx={{ mr: 1, mb: 1, p: 1 }}
                    />
                  ))}
                </Box>

                <Box mt={2}>
                  <Typography variant="overline">Population</Typography>
                  <Typography variant="body2">
                    {event?.population || 0}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Typography variant="overline">Equipment</Typography>
                  <Typography variant="body2">
                    {event?.equipment || "None"}
                  </Typography>
                </Box>

                <Box mt={2}>
                  <Typography variant="overline">
                    Additional Information
                  </Typography>
                  <Typography variant="body2">
                    {event?.additional || "None"}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box mt={2}>None requested</Box>
            )}
          </Grid>
        </Grid>

        {/* show Approval status */}
        {approvalStatus(event?.status)}
      </Box>
    )
  );
}

// set conditional actions based on event datetime, current status and user role
function getActions(event, user) {
  const upcoming = getDateObj(event?.startTime) >= new Date();

  /*
   * Deleted Event
   * CC/Club - copy
   * else - nothing
   */
  if (event?.status?.state === "deleted") {
    if (["club", "cc"].includes(user?.role)) return [CopyEvent];
    else return [];
  }

  /*
   * Club - incomplete event - edit, submit, delete
   * Club - upcoming event - edit, delete, copy
   * Club - past event - edit, copy
   */
  if (user?.role === "club") {
    if (event?.status?.state === "incomplete")
      return [SubmitEvent, EditEvent, DeleteEvent];
    else if (upcoming) return [EditEvent, DeleteEvent, CopyEvent];
    else return [EditEvent, CopyEvent];
  }

  /*
   * CC - pending approval - approve, edit, delete
   * CC - not incomplete event - delete, edit, copy
   * CC - incomplete event - edit
   */
  if (user?.role === "cc") {
    if (event?.status?.state === "pending_cc")
      return [ApproveEvent, EditEvent, DeleteEvent];
    else if (event?.status?.state !== "incomplete")
      return [EditEvent, DeleteEvent, CopyEvent];
    else return [EditEvent];
  }

  /*
   * SLC - upcoming event - approve
   */
  if (user?.role === "slc") {
    if (
      upcoming &&
      event?.status?.state !== "incomplete" &&
      !event?.status?.budget
    )
      return [ApproveEvent];
    else return [];
  }

  /*
   * SLO - upcoming event - approve, edit, delete
   * SLO - approved event - delete
   */
  if (user?.role === "slo") {
    if (
      // upcoming &&
      event?.status?.state !== "incomplete" &&
      event?.status?.budget &&
      !event?.status?.room
    )
      return [ApproveEvent, EditEvent, DeleteEvent];
    else return [DeleteEvent];
  }

  /*
   * else - nothing
   */
  return [];
}
