"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Typography, Divider } from "@mui/material";
import { EventCards, LoadingIndicator } from "./EventCards";

export default function PaginatedEventGrid({
  limit = 24, // Default limit if pagination is enabled
  targets = [null, null, null, null],
  clubs = [],
  query = async () => {},
}) {
  const [completedevents, setCompletedEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [loadingPast, setLoadingPast] = useState(false);
  const [loadingFuture, setLoadingFuture] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  const [targetName, targetClub, targetState, filterMonth] = targets;

  // Reference to the "load more" trigger element
  const loadMoreRef = useRef(null);

  const getClubBanner = (clubid) => {
    if (!clubid) {
      return null;
    }

    const club = clubs.find((club) => club.cid === clubid);
    return club?.bannerSquare || club?.logo;
  };

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
      eventsResponse.map((event) => {
        if (!event.poster) {
          event.clubbanner = getClubBanner(event?.clubid);
        }
      });

      setFutureEvents(eventsResponse);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingFuture(false);
    }
  };

  // Load future events on component mount
  useEffect(() => {
    loadFutureEvents();
  }, []);

  const loadPastEvents = useCallback(
    async (reset = false, newClub = null, newName = null) => {
      if (
        loadingPast ||
        (!reset && !hasMore) ||
        !targetState?.includes("completed")
      ) {
        return;
      }

      setLoadingPast(true);
      try {
        const queryData = {
          targetClub: newClub || targetClub || null,
          targetName: newName || targetName || null,
          paginationOn: true,
          skip: reset ? 0 : skip,
          limit,
          last4Months: filterMonth?.includes("last4Months") ? "true" : "false",
        };
        const eventsResponse = await query(queryData);
        // console.log(eventsResponse);
        eventsResponse.map((event) => {
          if (!event.poster) {
            event.clubbanner = getClubBanner(event?.clubid);
          }
        });

        const completedEvents = eventsResponse.filter(completedEventsFilter);
        const newEventsLength = completedEvents.length;

        if (reset) {
          setSkip(newEventsLength);
          setCompletedEvents(completedEvents);
        } else {
          setSkip((prevSkip) => prevSkip + newEventsLength);
          setCompletedEvents((prevEvents) => {
            const combinedEvents = [...prevEvents, ...completedEvents];
            return Array.from(
              new Set(combinedEvents.map((event) => event._id)),
            ).map((id) => combinedEvents.find((event) => event._id === id));
          });
        }

        setHasMore(newEventsLength === limit); // Check if we still have more events to load
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingPast(false);
      }
    },
    [loadingPast, hasMore, skip, limit, query],
  );

  // When targetClub or targetName changes, reset skip, hasMore, and completedEvents
  useEffect(() => {
    setCompletedEvents([]);
    loadPastEvents(true, targetClub, targetName);
  }, [targetClub, targetName, filterMonth]);

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
        if (!loadingPast && entries[0].isIntersecting && hasMore) {
          loadPastEvents(); // Load more events when the user reaches the bottom
        }
      },
      {
        threshold: 1.0,
      },
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
      <EventCards
        events={futureEvents.filter(ongoingEventsFilter)}
        loading={loadingFuture}
        noEventsMessage="No events found."
      />

      {targetState?.includes("upcoming") && (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Upcoming Events
            </Typography>
          </Divider>
          <EventCards
            events={futureEvents.filter(upcomingEventsFilter)}
            loading={loadingFuture}
            noEventsMessage="No events found."
          />
        </>
      )}

      {targetState?.includes("completed") && (
        <>
          <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
            <Typography variant="h5" color="grey">
              Completed Events
            </Typography>
          </Divider>
          {!loadingPast && !completedevents.length ? (
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}
            >
              No events found.
            </Typography>
          ) : (
            <EventCards
              events={completedevents}
              loading={false}
              noEventsMessage=""
            />
          )}
        </>
      )}

      {/* "Load more" trigger */}
      <div ref={loadMoreRef} style={{ height: "50px", marginBottom: "10px" }}>
        {loadingPast && <LoadingIndicator />}
      </div>
    </>
  );
}
