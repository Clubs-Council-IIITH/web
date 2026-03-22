import { getClient, combineQuery } from "gql/client";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_EVENTS_FOR_CALENDAR } from "gql/queries/events";
import { GET_HOLIDAYS } from "gql/queries/holidays";

import FullCalendar from "components/Calendar";

export const metadata = {
  title: "Calendar | Life @ IIIT-H",
};

export default async function Calendar() {
  const { document, variables } = combineQuery('CombinedCalendarQuery')
    .add(GET_ALL_CLUB_IDS)
    .add(GET_ALL_EVENTS_FOR_CALENDAR, { clubid: null })
    .add(GET_HOLIDAYS);

  const { data = {} } = await getClient().query(document, variables);
  const { allClubs, calendarEvents, holidays } = data;

  return (
    <FullCalendar
      events={calendarEvents}
      holidays={holidays}
      allClubs={allClubs}
    />
  );
}
