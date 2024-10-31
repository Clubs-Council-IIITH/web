"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import EventCard from "components/events/EventCard";

export default function PaginatedEventGrid({
  limit = 24, // Default limit if pagination is enabled
  targets = [null, null, null],
  query = async () => {},
  clubBannerQuery = async () => {},
}) {
  const [completedevents, setCompletedEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  const [loadingPast, setLoadingPast] = useState(false);
  const [loadingFuture, setLoadingFuture] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  const [targetName, targetClub, targetState] = targets;

  // Reference to the "load more" trigger element
  const loadMoreRef = useRef(null);

  const loadFutureEvents = async () => {
    if (loadingFuture || !targetState?.includes("upcoming")) {
      return;
    }

    setLoadingFuture(true);
    try {
      const queryData = {
        targetClub: null,
        targetName: null,
        paginationOn: true,
        skip: -1,
        limit: 10,
      };
      const eventsResponse = await query(queryData);
      // console.log(eventsResponse);
      await Promise.all(
        eventsResponse.map(async (event) => {
          if (!event.poster) {
            event.clubbanner = await clubBannerQuery(event.clubid);
          }
        })
      );

      setFutureEvents(eventsResponse);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingFuture(false);
    }
  };

  const loadPastEvents = useCallback(async () => {
    if (loadingPast || !hasMore || !targetState?.includes("completed")) {
      return;
    }

    setLoadingPast(true);
    try {
      const queryData = {
        targetClub,
        targetName,
        paginationOn: true,
        skip,
        limit,
      };
      const eventsResponse = await query(queryData);
      // console.log(eventsResponse);
      await Promise.all(
        eventsResponse.map(async (event) => {
          if (!event.poster) {
            event.clubbanner = await clubBannerQuery(event.clubid);
          }
        })
      );

      const completedEvents = eventsResponse.filter(completedEventsFilter);
      const newEventsLength = completedEvents.length;

      setCompletedEvents((prevEvents) => {
        const combinedEvents = [...prevEvents, ...completedEvents];
        return Array.from(
          new Set(combinedEvents.map((event) => event._id))
        ).map((id) => combinedEvents.find((event) => event._id === id));
      });

      setSkip((prevSkip) => prevSkip + newEventsLength);
      setHasMore(newEventsLength === limit); // Check if we still have more events to load
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingPast(false);
    }
  }, [loadingPast, hasMore, skip, limit, query]);

  // Load future events on component mount
  useEffect(() => {
    loadFutureEvents();
  }, []);

  // When targetClub or targetName changes, reset skip, hasMore, and completedEvents
  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    setCompletedEvents([]);
  }, [targetClub, targetName]);
  useEffect(() => {
    if (skip === 0) {
      loadPastEvents();
    }
  }, [skip]);

  const completedEventsFilter = (event) => {
    const selectedClub =
      !targetClub ||
      event?.clubid === targetClub ||
      event?.collabclubs.includes(targetClub);
    const selectedName =
      !targetName ||
      event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

    const selectedState = new Date(event?.datetimeperiod[1]) < new Date();

    return selectedClub && selectedState && selectedName;
  };

  const upcomingEventsFilter = (event) => {
    const selectedClub =
      !targetClub ||
      event?.clubid === targetClub ||
      event?.collabclubs.includes(targetClub);
    const selectedName =
      !targetName ||
      event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

    const selectedState = new Date(event?.datetimeperiod[0]) > new Date();

    return selectedClub && selectedState && selectedName;
  };

  const ongoingEventsFilter = (event) => {
    const selectedClub =
      !targetClub ||
      event?.clubid === targetClub ||
      event?.collabclubs.includes(targetClub);
    const selectedName =
      !targetName ||
      event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

    const selectedState =
      new Date(event?.datetimeperiod[0]) <= new Date() &&
      new Date(event?.datetimeperiod[1]) >= new Date();

    return selectedClub && selectedState && selectedName;
  };

  // Initialize IntersectionObserver to detect when "load more" is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPastEvents(); // Load more events when the user reaches the bottom
        }
      },
      {
        threshold: 1.0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadPastEvents, hasMore]);

  return (
    <>
      <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
        <Typography variant="h5" color="grey">
          Ongoing Events
        </Typography>
      </Divider>
      <Grid container spacing={2}>
        {futureEvents?.filter(ongoingEventsFilter)?.length ? (
          futureEvents?.filter(ongoingEventsFilter)?.map((event) => (
            <Grid key={event._id} item xs={6} md={4} lg={3}>
              <EventCard
                _id={event._id}
                name={event.name}
                datetimeperiod={event.datetimeperiod}
                poster={event.poster || event.clubbanner}
                clubid={event.clubid}
                blur={event.poster ? 0 : 0.3}
              />
            </Grid>
          ))
        ) : (
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
          >
            {loadingFuture ? <CircularProgress /> : "No events found."}
          </Typography>
        )}
      </Grid>

      {targetState?.includes("upcoming") && (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Upcoming Events
            </Typography>
          </Divider>
          <Grid container spacing={2}>
            {futureEvents?.filter(upcomingEventsFilter)?.length ? (
              futureEvents?.filter(upcomingEventsFilter)?.map((event) => (
                <Grid key={event._id} item xs={6} md={4} lg={3}>
                  <EventCard
                    _id={event._id}
                    name={event.name}
                    datetimeperiod={event.datetimeperiod}
                    poster={event.poster || event.clubbanner}
                    clubid={event.clubid}
                    blur={event.poster ? 0 : 0.3}
                  />
                </Grid>
              ))
            ) : (
              <Typography
                variant="h4"
                color="text.secondary"
                sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
              >
                {loadingFuture ? (
                  targetState?.includes("completed") ? (
                    <CircularProgress />
                  ) : (
                    ""
                  )
                ) : (
                  "No events found."
                )}
              </Typography>
            )}
          </Grid>
        </>
      )}

      {targetState?.includes("completed") && (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Completed Events
            </Typography>
          </Divider>
          <Grid container spacing={2}>
            {completedevents?.length ? (
              completedevents?.map((event) => (
                <Grid key={event._id} item xs={6} md={4} lg={3}>
                  <EventCard
                    _id={event._id}
                    name={event.name}
                    datetimeperiod={event.datetimeperiod}
                    poster={event.poster || event.clubbanner}
                    clubid={event.clubid}
                    blur={event.poster ? 0 : 0.3}
                  />
                </Grid>
              ))
            ) : (
              <Typography
                variant="h4"
                color="text.secondary"
                sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
              >
                {loadingPast ? "" : "No events found."}
              </Typography>
            )}
          </Grid>
        </>
      )}

      {/* "Load more" trigger */}
      <div ref={loadMoreRef} style={{ height: "50px", marginBottom: "10px" }}>
        {loadingPast && (
          // center the circular progress
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            mt={3}
          >
            <CircularProgress />
          </Box>
        )}
      </div>
    </>
  );
}
