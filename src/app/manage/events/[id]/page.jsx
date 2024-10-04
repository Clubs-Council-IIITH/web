import { getClient } from "gql/client";
import { GET_FULL_EVENT, GET_EVENT_BILLS_STATUS } from "gql/queries/events";
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
  EditFinances,
} from "components/events/EventActions";
import {
  EventStatus,
  BudgetStatus,
  VenueStatus,
} from "components/events/EventStates";

import { locationLabel, billsStateLabel } from "utils/formatEvent";
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
    redirect("/404");
  }
}

async function billsStatus(event) {
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
    </>
  );
}

async function approvalStatus(status, isStudentBodyEvent = false) {
  let lastEditeduser = null;
  let ccApprover = null;
  let slcApprover = null;
  let deletedBy = null;

  if (status?.lastUpdatedBy) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.lastUpdatedBy,
        },
      });
      lastEditeduser = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.ccApprover) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.ccApprover,
        },
      });
      ccApprover = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.slcApprover) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.slcApprover,
        },
      });
      slcApprover = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.deletedBy) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.deletedBy,
        },
      });
      deletedBy = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Divider sx={{ borderStyle: "dashed", my: 2 }} />
      <Typography variant="subtitle2" gutterBottom>
        TIMELINE{" "}
        <Typography variant="caption" gutterBottom sx={{ marginLeft: 1 }}>
          (Times in IST)
        </Typography>
      </Typography>

      <Grid container spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box mt={2}>Last Edited</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box mt={2}>-</Box>
          </Grid>
          <Grid item xs>
            <Box mt={2}>
              {status?.lastUpdatedTime == null
                ? "Information not available"
                : (status?.lastUpdatedTime.includes(":") ? "Edited on " : "") +
                  status?.lastUpdatedTime}
            </Box>
          </Grid>
        </Grid>
        {status?.lastUpdatedBy != null ? (
          <Grid container item spacing={2}>
            <Grid item xs={5} lg={3}>
              <Box mt={0}>Last Edited By</Box>
            </Grid>
            <Grid item xs={1} lg={0.1}>
              <Box mt={0}>-</Box>
            </Grid>
            <Grid item xs>
              <Box mt={0}>{lastEditeduser}</Box>
            </Grid>
          </Grid>
        ) : null}
        {status?.state && status?.state == "deleted" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box mt={1}>Event Deletion</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box mt={1}>-</Box>
              </Grid>
              <Grid item xs>
                <Box mt={1}>
                  {status?.deletedTime == null
                    ? "Information not available"
                    : (status?.deletedTime.includes(":") ? "Deleted on " : "") +
                      status?.deletedTime}
                </Box>
              </Grid>
            </Grid>
            {status?.deletedTime != null && status?.deletedBy != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box mt={0}>Event Deleted By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box mt={0}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box mt={0}>{deletedBy}</Box>
                </Grid>
              </Grid>
            ) : null}
          </>
        ) : status?.state && status?.state !== "incomplete" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box mt={1}>Event Submission</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box mt={1}>-</Box>
              </Grid>
              <Grid item xs>
                <Box mt={1}>
                  {status?.submissionTime == null
                    ? "Information not available"
                    : (status?.submissionTime.includes(":")
                        ? "Submitted on "
                        : "") + status?.submissionTime}
                </Box>
              </Grid>
            </Grid>

            {!isStudentBodyEvent ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box mt={1}>Clubs Council Approval</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box mt={1}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box mt={1}>
                    {status?.ccApproverTime == null
                      ? "Information not available"
                      : (status?.ccApproverTime.includes(":")
                          ? "Approved on "
                          : "") + status?.ccApproverTime}
                  </Box>
                </Grid>
              </Grid>
            ) : null}

            {status?.ccApprover != null && status?.ccApproverTime != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box mt={0}>Clubs Council Approved By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box mt={0}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box mt={0}>{ccApprover}</Box>
                </Grid>
              </Grid>
            ) : null}

            {!isStudentBodyEvent ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box mt={1}>Students Life Council Approval</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box mt={1}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box mt={1}>
                    {status?.slcApproverTime == null
                      ? "Information not available"
                      : (status?.slcApproverTime.includes(":")
                          ? "Approved on "
                          : "") + status?.slcApproverTime}
                  </Box>
                </Grid>
              </Grid>
            ) : null}
            {status?.slcApprover != null && status?.slcApproverTime != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box mt={0}>Students Life Council Approved By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box mt={0}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box mt={0}>{slcApprover}</Box>
                </Grid>
              </Grid>
            ) : null}

            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box mt={1}>Students Life Office Approval</Box>
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
          </>
        ) : null}
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
    user?.role === "club" &&
      user?.uid !== event.clubid &&
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
        {approvalStatus(event?.status, event?.studentBodyEvent)}
        {["cc", "club", "slo"].includes(user?.role) ? billsStatus(event) : null}
      </Box>
    )
  );
}

// set conditional actions based on event datetime, current status and user role
function getActions(event, user) {
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
      // upcoming &&
      event?.status?.state === "pending_budget" &&
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
      event?.status?.state === "pending_room" &&
      (event?.status?.budget || event?.studentBodyEvent) &&
      !event?.status?.room
    )
      return [ApproveEvent, EditEvent, DeleteEvent];
    else if (
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
