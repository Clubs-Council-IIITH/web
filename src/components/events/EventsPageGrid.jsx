"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { constructEventsQuery } from "gql/queries/events";


import { Grid, Typography } from "@mui/material";
import EventCard from "components/events/EventCard";

export default function EventsGrid({
  type = "all", // must be one of: {recent, club, all}, by default it should fetch all the events
  allclubs = null,
  paginationOn = false,
  limit = undefined,
  targets = [null, null, null],
  query = () => { },
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const hasFetched = useRef(false); // Ref to track if the initial fetch has been done

  const [targetName, targetClub, targetState] = targets;
  const targetsRef = useRef(targets);

  if (paginationOn && limit === undefined) {
    limit = 20;
  }

  function filter(event) {
    let selectedClub = false,
      selectedState = false,
      selectedName = false;

    // filter by club
    if (!targetClub) selectedClub = true;
    else selectedClub = event?.clubid === targetClub;

    // filter by state
    if (!targetState) selectedState = true;
    else {
      const isUpcoming = new Date(event?.datetimeperiod[1]) > new Date();
      if (targetState?.includes("upcoming") && isUpcoming)
        selectedState = true;
      if (targetState?.includes("completed") && !isUpcoming)
        selectedState = true;
    }

    // filter by name
    if (!targetName) selectedName = true;
    else
      selectedName = event?.name
        ?.toLowerCase()
        ?.includes(targetName?.toLowerCase());

    return selectedClub && selectedState && selectedName;
  }

  const loadEvents = useCallback(async () => {
    // console.log("Lengths of events array is : ", events.length);
    if ((loading || !hasMore) && targets == targetsRef.current) {
      return;
    }

    setLoading(true);

    try {
      let data;
      if (targetClub)
        data = await query(JSON.parse(JSON.stringify(constructEventsQuery({ type: "club", clubid: targetClub, paginationOn, skip, limit }))));
      else
        data = await query(JSON.parse(JSON.stringify(constructEventsQuery({ type: "all", clubid: targetClub, paginationOn, skip, limit }))));

      // Fake sleep
      for (let i = 0; i < 1000000; i += 1) {
        i = i + 1;
        i -= 1;
      }

      let newEvents = data?.data?.approvedEvents?.filter((event) =>
        ["approved", "completed"].includes(event?.status?.state)
      )?.filter(filter);

      if (targets != targetsRef.current) {
        setEvents(newEvents);
        setSkip(newEvents.length);
      }
      else {
        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        setSkip((prevSkip) => prevSkip + newEvents.length);
      }
      setHasMore(newEvents.length && newEvents.length === limit);
      targetsRef.current = targets;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }

  }, [loading, hasMore, skip, targets]);

  useEffect(() => {
    if (hasFetched.current) {
      return; // If it's already fetched, do nothing
    }
    hasFetched.current = true;
    loadEvents();
    setInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    // setEvents([]);
    // setSkip(0);
    // setHasMore(true);
    loadEvents();
  }, [targets]);

  function debounce(func, wait) {
    let timeout = 1000;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedLoadEvents = useCallback(debounce(loadEvents, 1000), [
    loadEvents,
  ]);

  useEffect(() => {
    if (type === "recent") return;
    if (initialLoadComplete) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            debouncedLoadEvents();
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      const sentinel = document.getElementById("sentinel");
      if (sentinel) observer.observe(sentinel);

      return () => {
        if (sentinel) observer.unobserve(sentinel);
      };
    }
  }, [loading, hasMore, debouncedLoadEvents]);

  return (
    <>
      <Grid container spacing={2}>
        {events && events.length ? events
          ?.map(async (event) => {
            let club = allclubs?.find((club) => club.cid === event.clubid);

            return (
              <Grid key={event._id} item xs={6} md={4} lg={3}>
                <EventCard
                  _id={event._id}
                  name={event.name}
                  datetimeperiod={event.datetimeperiod}
                  poster={event.poster ? event.poster : club.banner ? club.banner : club.logo}
                />
              </Grid>
            )
          }) :
          <Typography variant="h4" color="text.secondary" sx={{ flexGrow: 1, textAlign: "center", mt: 5 }}>
            No events found.
          </Typography>
        }
      </Grid>
      <div id="sentinel" style={{ height: "1px" }}></div>
    </>
  );
}