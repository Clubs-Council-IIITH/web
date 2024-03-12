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

export default async function ManageEvent({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
    eventid: id,
  });

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );

  return (
    <Box>
      <ActionPalette
        left={[EventStatus, BudgetStatus, VenueStatus]}
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
    </Box>
  );
}

// set conditional actions based on event datetime, current status and user role
function getActions(event, user) {
  const upcoming = new Date(event?.datetimeperiod[0]) >= new Date();

  /*
   * Deleted - nothing
   */
  if (event?.status?.state === "deleted") {
    return [];
  }

  /*
   * Club - incomplete event - edit, submit, delete
   * Club - upcoming event - edit, delete
   * Club - past event - nothing
   */
  if (user?.role === "club") {
    if (event?.status?.state === "incomplete")
      return [SubmitEvent, EditEvent, DeleteEvent];
    else if (upcoming) return [EditEvent, DeleteEvent];
    else return [EditEvent];
  }

  /*
   * CC - pending approval - approve, edit, delete
   * CC - not incomplete event - delete, edit
   * CC - incomplete event - edit
   */
  if (user?.role === "cc") {
    if (event?.status?.state === "pending_cc")
      return [ApproveEvent, EditEvent, DeleteEvent];
    else if (event?.status?.state !== "incomplete")
      return [EditEvent, DeleteEvent];
    else return [EditEvent];
  }

  /*
   * SLC/SLO - upcoming event - approve
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
  if (user?.role === "slo") {
    if (
      upcoming &&
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
