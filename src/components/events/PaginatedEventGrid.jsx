  "use client";

  import { useEffect, useState, useCallback, useRef } from "react";
  import { Grid, Typography, Divider, CircularProgress } from "@mui/material";
  import EventsGrid from "./EventsGridPage";


  export default function PaginatedEventGrid({
    type = "all",
    limit = 30, // Default limit if pagination is enabled
    targets = [null, null, null],
    query = () => {},
    clubquery = () => {}
  }) {
    const [completedevents, setCompletedEvents] = useState([]);
    const [ongoingevents, setOngoingEvents] = useState([]);
    const [upcomingevents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);
    const [targetName, targetClub, targetState] = targets;

    // Reference to the "load more" trigger element
    const loadMoreRef = useRef(null);

    const loadEvents = useCallback(async () => {
      if (loading || !hasMore) {
        return;
      }

      setLoading(true);
      try {
        const queryData = {
          type,
          targetClub,
          paginationOn: true,
          skip,
          limit,
        };
        const eventsResponse = await query(queryData);
        eventsResponse.forEach(async (event) => {
          if (!event.poster) {
            event.clubbanner = await clubquery(event.clubid);
          }
        });

        const ongoingEvents = eventsResponse.filter(ongoingEventsFilter);
        const upcomingEvents = eventsResponse.filter(upcomingEventsFilter);
        const completedEvents = eventsResponse.filter(completedEventsFilter);

        setOngoingEvents((prevEvents) => {
          const combinedEvents = [...prevEvents, ...ongoingEvents];
          return Array.from(new Set(combinedEvents.map(event => event._id))).map(id => combinedEvents.find(event => event._id === id));
        });

        setUpcomingEvents((prevEvents) => {
          const combinedEvents = [...prevEvents, ...upcomingEvents];
          return Array.from(new Set(combinedEvents.map(event => event._id))).map(id => combinedEvents.find(event => event._id === id));
        });

        setCompletedEvents((prevEvents) => {
          const combinedEvents = [...prevEvents, ...completedEvents];
          return Array.from(new Set(combinedEvents.map(event => event._id))).map(id => combinedEvents.find(event => event._id === id));
        });

        const totalLength = ongoingEvents.length + upcomingEvents.length + completedEvents.length;
        setSkip((prevSkip) => prevSkip + totalLength); // Increment skip by number of new events
        setHasMore(totalLength === limit); // Check if we still have more events to load
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }, [loading, hasMore, skip, limit, query]);

    useEffect(() => {
      setSkip(0);  // Reset pagination when targets change
      setHasMore(true);  // Allow loading more events with new filters
      setOngoingEvents([]);
      setUpcomingEvents([]);
      setCompletedEvents([]);
      loadEvents();  // Fetch events with new targets
    }, [targetClub, targetName, targetState]);  // Re-run whenever these change
    

    const completedEventsFilter = (event) => {
      const selectedClub =
        !targetClub || event?.clubid === targetClub || event?.collabclubs.includes(targetClub);
      const selectedState = !targetState || new Date(event?.datetimeperiod[1]) < new Date();
      const selectedName = !targetName || event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

      return selectedClub && selectedState && selectedName;
    };

    const upcomingEventsFilter = (event) => {
      const selectedClub =
        !targetClub || event?.clubid === targetClub || event?.collabclubs.includes(targetClub);
      const selectedState = !targetState || new Date(event?.datetimeperiod[0]) > new Date();
      const selectedName = !targetName || event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

      return selectedClub && selectedState && selectedName;
    };

    const ongoingEventsFilter = (event) => {
      const selectedClub =
        !targetClub || event?.clubid === targetClub || event?.collabclubs.includes(targetClub);
      const selectedState = !targetState || new Date(event?.datetimeperiod[0]) <= new Date() && new Date(event?.datetimeperiod[1]) >= new Date();
      const selectedName = !targetName || event?.name?.toLowerCase()?.includes(targetName?.toLowerCase());

      return selectedClub && selectedState && selectedName;
    };

    // Initialize IntersectionObserver to detect when "load more" is visible
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadEvents(); // Load more events when the user reaches the bottom
        }
      }, {
        threshold: 1.0
      });

      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }

      return () => {
        if (loadMoreRef.current) {
          observer.unobserve(loadMoreRef.current);
        }
      };
    }, [loadEvents, hasMore]);

    return (
      <>
        <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
          <Typography variant="h5" color="grey">
            Ongoing Events
          </Typography>
        </Divider>

        <EventsGrid
          type="all"
          limit={30}
          events={ongoingevents}
          loading={loading}
        />

        {targetState?.includes("upcoming") ? (
          <>
            <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
              <Typography variant="h5" color="grey">
                Upcoming Events
              </Typography>
            </Divider>

            <EventsGrid
              type="all"
              limit={30}
              events={upcomingevents}
              loading={loading}
            />
          </>
        ) : null}

        {targetState?.includes("completed") ? (
          <>
            <Divider textAlign="left" sx={{ mb: 2, mt: 3 }}>
              <Typography variant="h5" color="grey">
                Completed Events
              </Typography>
            </Divider>

            <EventsGrid
              type="all"
              limit={30}
              events={completedevents}
              loading={loading}
            />
          </>
        ) : null}

        {/* "Load more" trigger */}
        <div ref={loadMoreRef} style={{ height: "50px", marginBottom: "10px" }}>
          {loading && <CircularProgress />}
        </div>
      </>
    );
  }
