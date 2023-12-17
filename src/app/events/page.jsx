"use client";

import { Box } from "@mui/material";
import EventsFilter from "components/events/EventsFilter";
import {
  GET_RECENT_EVENTS_STRING,
  GET_CLUB_EVENTS_STRING,
  GET_ALL_EVENTS_STRING,
} from "gql/queries/events";

import { GET_CLUB_STRING } from "gql/queries/clubs";

import EventsGrid from "components/events/EventsGrid";

import { useEffect, useState, useRef, useCallback } from "react";
import { RestaurantRounded } from "@mui/icons-material";

const GRAPHQL_ENDPOINT = "http://localhost:80/graphql";
// process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

export default function Events({ searchParams }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0); // New state variable for skip
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const hasFetched = useRef(false); // Ref to track if the initial fetch has been done

  const targetName = searchParams?.name;
  const targetClub = searchParams?.club;
  const targetState = [
    ...(searchParams?.upcoming === "true" ? ["upcoming"] : []),
    ...(searchParams?.completed === "true" ? ["completed"] : []),
  ];
  let type = "all"; // TODO: type = "recent" is not working
  let clubid = null;
  let paginationOn = true;
  let limit = 20;

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

  const loadEvents = useCallback(async () => {
    console.log("Lengths of events array is : ", events.length);
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const queryPayload = constructQueryPayload({
        type,
        clubid,
        paginationOn,
        skip: skip, // Use the length of the current events array as the next 'skip' value
        limit,
      });
      let res = await fetchData(queryPayload);
      const newEvents = extractEvents(type, res);
      console.log(skip)
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setSkip((prevSkip) => prevSkip + newEvents.length);
      setHasMore(newEvents.length === limit);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip]); // Add all dependencies here

  useEffect(() => {
    if (hasFetched.current) {
      return; // If it's already fetched, do nothing
    }
    hasFetched.current = true;
    loadEvents();
    setInitialLoadComplete(true);
  }, []);

  const debouncedLoadEvents = useCallback(debounce(loadEvents, 1000), [
    loadEvents,
  ]);

  useEffect(() => {
    if(type === "recent") return;
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
    <Box>
      <Box mt={2} mb={3}>
        <EventsFilter name={targetName} club={targetClub} state={targetState} />
      </Box>
      <EventsGrid
        events={Object.values(
          events.reduce((acc, event) => {
            acc[event._id] = event; // Use event ID as the key for uniqueness
            return acc;
          }, {})
        )}
        filter={(event) => {
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
        }}
      />
      <div id="sentinel" style={{ height: "1px" }}></div>
    </Box>
  );
}

async function fetchData(queryPayload) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryPayload),
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return response.json();
}

function constructQueryPayload({ type, clubid, paginationOn, skip, limit }) {
  let query;
  let variables = {};

  if (type === "recent") {
    query = GET_RECENT_EVENTS_STRING;
  } else if (type === "club") {
    query = GET_CLUB_EVENTS_STRING;
    variables = {
      clubid,
      clubInput: { cid: clubid },
      pagination: paginationOn,
      skip,
      limit,
    };
  } else if (type === "all") {
    query = GET_ALL_EVENTS_STRING;
    variables = { clubid: null, pagination: paginationOn, skip, limit };
  }

  return { query, variables };
}

function extractEvents(type, data) {
  if (type === "recent") {
    return data?.recentEvents;
  } else if (type === "club") {
    return data?.data?.events?.filter((event) =>
      ["approved", "completed"].includes(event?.status?.state)
    );
  } else if (type === "all") {
    return data?.data?.events?.filter((event) =>
      ["approved", "completed"].includes(event?.status?.state)
    );
  }
}
