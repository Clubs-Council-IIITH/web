import { getClient } from "gql/client";
import { GET_FULL_EVENT, GET_EVENT_BILLS_STATUS } from "gql/queries/events";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { GET_CLASHING_EVENTS } from "gql/queries/events";
import { getFullUser } from "actions/users/get/full/server_action";

import {
  Box,
  Chip,
  Grid,
  Typography,
  Divider,
  CardActionArea,
} from "@mui/material";
import { Link } from "next/link";
import { notFound, redirect } from "next/navigation";
import ActionPalette from "components/ActionPalette";

import EventDetails from "components/events/EventDetails";
import EventBudget from "components/events/EventBudget";
import EventBillStatus from "components/events/bills/EventBillStatus";
import EventReportStatus from "components/events/report/EventReportStatus";
import EventApprovalStatus from "components/events/EventApprovalStatus";
import { DownloadEvent } from "components/events/report/EventpdfDownloads";
import {
  EditEvent,
  CopyEvent,
  ApproveEvent,
  LocationClashApproval,
  ProgressEvent,
  DeleteEvent,
  SubmitEvent,
  EditFinances,
  RequestReminder,
} from "components/events/EventActions";
import {
  EventStatus,
  BudgetStatus,
  VenueStatus,
} from "components/events/EventStates";

import { locationLabel } from "utils/formatEvent";
import MemberListItem from "components/members/MemberListItem";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });

    return {
      title: event.name,
    };
  } catch (error) {
    notFound();
  }
}

export default async function ManageEventID({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
    eventid: id,
  });

  let eventBillsData = null;

  if (
    event &&
    event?.status?.state === "approved" &&
    new Date(event?.datetimeperiod[1]) < new Date() &&
    event?.budget?.length
  ) {
    const { error, data = {} } = await getClient().query(
      GET_EVENT_BILLS_STATUS,
      {
        eventid: id,
      },
    );
    if (error && error.message.includes("Event not found"))
      return redirect("/404");
    eventBillsData = data;
  }

  const {
    data: { activeClubs },
  } = await getClient().query(GET_ACTIVE_CLUBS);
  

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );

  const user = { ...userMeta, ...userProfile };
  let clashFlag = false;
  if(["cc", "slo"].includes(user?.role)){

    const { data: { clashingEvents } = {} } = await getClient().query(
      GET_CLASHING_EVENTS,
      {
        eventId: id,
      },
    );
    clashFlag = clashingEvents && clashingEvents.length > 0;
  }

  const billViewable =
    ["cc", "slo"].includes(user?.role) ||
    (user?.role === "club" && user?.uid === event?.clubid);

  const pocProfile = await getFullUser(event?.poc);
  if (!pocProfile) {
    return redirect("/404");
  }

  return (
    user?.role === "club" &&
      user?.uid !== event?.clubid &&
      !event?.collabclubs.includes(user?.uid) &&
      redirect("/404"),
    (
      <Box>
        <ActionPalette
          left={[EventStatus, BudgetStatus, VenueStatus]}
          leftProps={[
            { status: event?.status },
            { status: event?.status, budget: event?.budget },
            { status: event?.status, location: event?.location },
          ]}
          right={getActions(event, clashFlag, { ...userMeta, ...userProfile })}
          downloadbtn={
            <DownloadEvent
              event={event}
              clubs={activeClubs}
              pocProfile={pocProfile}
              eventBills={eventBillsData?.eventBills || {}}
            />
          }
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
                billViewable={billViewable}
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

                {event?.locationAlternate && event?.locationAlternate.length ? (
                  <Box mt={2}>
                    <Typography variant="overline">
                      Alternate Locations
                    </Typography>
                    <Box mt={1}>
                      {event?.locationAlternate?.map((venue, key) => (
                        <Chip
                          key={key}
                          label={locationLabel(venue)?.name}
                          sx={{ mr: 1, mb: 1, p: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : null}

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

            <Grid container spacing={2} mt={0.1}>
              <Grid item xs={4}>
                <Box>
                  <Typography variant="overline">Population</Typography>
                  <Typography variant="body2">
                    {event?.population || 0}
                  </Typography>
                </Box>
              </Grid>
              {event?.externalPopulation && event.externalPopulation > 0 ? (
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="overline">
                      External Population
                    </Typography>
                    <Typography variant="body2">
                      {event?.externalPopulation || 0}
                    </Typography>
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>

        {/* show Approval status */}
        {EventApprovalStatus(event?.status, event?.clubCategory != "club")}

        {/* show post event information */}
        {["cc", "club", "slo"].includes(user?.role) &&
          EventBillStatus(event, eventBillsData?.eventBills || null, user?.uid)}
        {["cc", "club", "slo"].includes(user?.role) &&
          EventReportStatus(event, user)}
      </Box>
    )
  );
}

// set conditional actions based on event datetime, current status and user role
function getActions(event, clashFlag, user) {
  const upcoming = new Date(event?.datetimeperiod[0]) >= new Date();
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
    if (user?.uid !== event?.clubid) return [CopyEvent];
    else if (event?.status?.state === "incomplete")
      return [SubmitEvent, EditEvent, DeleteEvent];
    else if (upcoming) return [EditEvent, DeleteEvent, CopyEvent];
    else return [EditEvent, CopyEvent];
  }

  /*
   * CC - pending approval - progress, edit, delete
   * CC - not incomplete event - delete, edit, copy
   * CC - incomplete event - edit
   */
  if (user?.role === "cc") {
    if (event?.status?.state === "pending_cc")
      return [ProgressEvent, EditEvent, DeleteEvent];
    else if (event?.status?.state === "pending_room")
      return [RequestReminder, EditEvent, DeleteEvent];
    else if (event?.status?.state !== "incomplete")
      return [EditEvent, DeleteEvent, CopyEvent];
    else return [EditEvent];
  }

  /*
   * SLC - upcoming event - approve
   */
  if (user?.role === "slc") {
    if (
      // upcoming &&
      event?.status?.state === "pending_budget" &&
      !event?.status?.budget
    ) {
      return [ApproveEvent];
    } else return [];
  }

  /*
   * SLO - upcoming event - approve, edit, delete
   * SLO - approved event - delete
   */
  if (user?.role === "slo") {
    if (
      // upcoming &&
      event?.status?.state === "pending_room" &&
      (event?.status?.budget || event?.clubCategory == "body") &&
      !event?.status?.room
    ) {
      if (clashFlag) return [LocationClashApproval, EditEvent, DeleteEvent];
      return [ApproveEvent, EditEvent, DeleteEvent];
    } else if (
      event?.status?.state === "approved" &&
      !upcoming &&
      event?.budget?.length
    )
      return [EditFinances, DeleteEvent];
    else return [DeleteEvent];
  }

  /*
   * else - nothing
   */
  return [];
}
