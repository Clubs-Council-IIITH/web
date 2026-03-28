import { getClient } from "gql/client";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_EVENTS_FOR_CALENDAR } from "gql/queries/events";
import { GET_HOLIDAYS } from "gql/queries/holidays";

import FullCalendar from "components/Calendar";

export const metadata = {
  title: "Calendar | Life @ IIIT-H",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Calendar() {
  const { data: { allClubs } = {} } = await getClient(false).query(GET_ALL_CLUB_IDS, {}, {
    requestPolicy: 'cache-first', fetchOptions: { cache: 'force-cache', next: { revalidate: 3600} }
  });

  const { data: { calendarEvents } = {} } = await getClient(false).query(
    GET_ALL_EVENTS_FOR_CALENDAR,
    {
      clubid: null,
    }, { requestPolicy: 'cache-first', fetchOptions: {cache: 'force-cache', next: { revalidate: 3600} }},
  );

  const { data: { holidays } = {} } = await getClient(false).query(GET_HOLIDAYS, {}, { 
      requestPolicy: 'cache-first',
      fetchOptions: {cache: 'force-cache',
        next: { revalidate: 3600 }
      } 
    }
  );

  return (
    <FullCalendar
      events={calendarEvents}
      holidays={holidays}
      allClubs={allClubs}
    />
  );
}
