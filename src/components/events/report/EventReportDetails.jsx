"use client";

import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
  CardActionArea,
} from "@mui/material";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Icon from "components/Icon";
import { locationLabel, audienceLabels } from "utils/formatEvent";
import { DownloadEventReport } from "components/events/report/EventpdfDownloads";
import { DownloadEventReportDocx } from "components/events/report/EventDocxDownloads";
import MemberListItem from "components/members/MemberListItem";
import EventBudget from "components/events/EventBudget";
import { canEditReport } from "utils/eventReportAuth";

const DateTime = dynamic(() => import("components/DateTime"), { ssr: false });

export function EventReportDetails({
  event,
  eventReport,
  submittedUser,
  clubs,
  user,
}) {
  const showEditReportButton = canEditReport(event, eventReport, user);

  return (
    <Box p={2}>
      <Grid
        container
        sx={{
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Button
          color="primary"
          component={Link}
          href={`/manage/events/${event?._id}`}
          startIcon={<Icon variant="arrow-back" />}
        >
          <Typography variant="button" color="opposite">
            Back to Event
          </Typography>
        </Button>
        <Grid item sx={{ display: "flex", gap: 2, alignSelf: "right" }}>
          {showEditReportButton && (
            <Button
              component={Link}
              href={`/manage/events/${event?._id}/report/edit`}
              variant="contained"
              color="warning"
              startIcon={<Icon variant="edit-outline" />}
            >
              Edit Report
            </Button>
          )}

          <DownloadEventReport
            event={event}
            eventReport={eventReport}
            submittedUser={submittedUser}
            clubs={clubs}
          />
          <DownloadEventReportDocx
            event={event}
            eventReport={eventReport}
            submittedUser={submittedUser}
            clubs={clubs}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Typography variant="h3" mt={1} mb={2} ml={2}>
          Event Report
        </Typography>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4} sm={6}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Details
          </Typography>
          <Box mt={2}>
            <Typography variant="overline">Event Name</Typography>
            <Typography variant="body2">{event?.name || "None"}</Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="overline">Organized By</Typography>
            <Typography variant="body2">
              <span>
                {clubs?.find((club) => club.cid === event?.clubid)?.name}
              </span>
              <br />
              {event?.collabclubs
                ?.map(
                  (collab) => clubs?.find((club) => club?.cid === collab)?.name,
                )
                .join(", ")}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="overline">Event Date</Typography>
            <Typography variant="body2">
              <DateTime dt={event?.datetimeperiod[0]} /> -{" "}
              <DateTime dt={event?.datetimeperiod[1]} />
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="overline">Report Submitted on</Typography>
            <Typography variant="body2">
              <DateTime dt={eventReport?.submittedTime} />
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sm={6}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Attendance
          </Typography>
          <Box mt={2}>
            <Typography variant="overline">Batches Participated</Typography>
            <Typography variant="body2">
              {event?.audience
                ? audienceLabels(event?.audience)
                    .map(({ name, color }) => name)
                    .join(", ")
                : "None"}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="overline">Mode</Typography>
            <Typography variant="body2">{event?.mode || "None"}</Typography>
          </Box>
          <Grid container spacing={2} mt={0.1} mb={4}>
            <Grid item xs={4}>
              <Box>
                <Typography variant="overline">Estimated</Typography>
                <Typography variant="body2">
                  {event?.population || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <Typography variant="overline">Attended</Typography>
                <Typography variant="body2">
                  {eventReport?.attendance || "None"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {event?.externalPopulation ? (
            <>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                gutterBottom
              >
                EXTERNAL ATTENDANCE
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="overline">Estimated</Typography>
                    <Typography variant="body2">
                      {event?.externalPopulation || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box>
                    <Typography variant="overline">Attended</Typography>
                    <Typography variant="body2">
                      {eventReport?.externalAttendance || "None"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : null}
        </Grid>

        <Grid item xs={12} md={4} sm={6}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Prizes
          </Typography>
          {eventReport?.prizes?.length > 0 && (
            <>
              <Box mt={2}>
                {eventReport?.prizes.map((prize, key) => (
                  <Chip
                    key={key}
                    label={prize.replace(/_/g, " ").toUpperCase()}
                    sx={{ mr: 1, mb: 1, p: 1 }}
                  />
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="overline">Prizes Breakdown</Typography>
                <Typography variant="body2">
                  {eventReport?.prizesBreakdown
                    ? eventReport?.prizesBreakdown
                        .split("\n")
                        .map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))
                    : "None"}
                </Typography>
              </Box>
            </>
          )}
          <Box mt={2}>
            <Typography variant="overline">Winners</Typography>
            <Typography variant="body2">
              {eventReport?.winners
                ? eventReport?.winners.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : "None"}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="overline">Photos/Videos Link</Typography>
            <Typography variant="body2">
              <a
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  overflowWrap: "break-word",
                }}
                href={eventReport?.photosLink}
                target="_blank"
                rel="noreferrer"
              >
                {eventReport?.photosLink || "None"}
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12} mt={3}>
        <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
          Summary of the event held
        </Typography>
        <Box mt={2}>
          <Typography variant="body2">
            {eventReport?.summary
              ? eventReport?.summary?.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "None"}
          </Typography>
        </Box>
      </Grid>

      <Divider sx={{ borderStyle: "dashed", my: 2 }} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={6} sm={12}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Budget
          </Typography>
          {event?.budget?.length ? (
            <EventBudget
              rows={event?.budget.map((b, key) => ({ ...b, id: b?.id || key }))}
              editable={false}
            />
          ) : (
            <Box mt={2}>None requested</Box>
          )}
        </Grid>

        <Grid item xs={12} lg={2} md={6} sm={6}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Venue
          </Typography>
          {event?.location?.length ? (
            <>
              <Box mt={2}>
                {event?.location.map((venue, key) => (
                  <Chip
                    key={key}
                    label={
                      venue === "other"
                        ? event.otherLocation || "Other"
                        : locationLabel(venue)?.name
                    }
                    sx={{ mr: 1, mb: 1, p: 1 }}
                  />
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="overline">Equipment</Typography>
                <Typography variant="body2">
                  {event?.equipment
                    ? event?.equipment?.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    : "None"}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="overline">
                  Additional Information
                </Typography>
                <Typography variant="body2">
                  {event?.additional
                    ? event?.additional?.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    : "None"}
                </Typography>
              </Box>
            </>
          ) : (
            <Box mt={2}>None requested</Box>
          )}
        </Grid>
        <Grid item xs={12} lg={4} md={6} sm={6}>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            gutterBottom
          >
            Report Submitted By
          </Typography>
          <CardActionArea
            component={Link}
            href={`/profile/${eventReport?.submittedBy}`}
            sx={{ textDecoration: "none", maxWidth: "max-content" }}
          >
            <MemberListItem uid={eventReport?.submittedBy} />
          </CardActionArea>
          <Typography variant="body2" color="text.secondary">
            ID No: {submittedUser?.data?.rollno || "None"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone Number: {submittedUser?.data?.phone || "None"}
          </Typography>
          <Grid item xs={12} mt={2}>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              gutterBottom
            >
              Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {eventReport?.feedbackCc
                ? eventReport?.feedbackCc?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                : "None"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
