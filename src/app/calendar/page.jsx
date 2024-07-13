import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";
import { GET_HOLIDAYS } from "gql/queries/holidays";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";

import FullCalendar from "components/Calendar";

export const metadata = {
  title: "Calendar",
};

export default async function Calendar() {
  const { data: { allClubs } = {} } = await getClient().query(GET_ALL_CLUB_IDS);

  const { data: { events } = {} } = await getClient().query(GET_ALL_EVENTS, {
    clubid: null,
    public: false,
  });

  const { data: { holidays } = {} } = await getClient().query(GET_HOLIDAYS);

  return (
    <FullCalendar events={events} holidays={holidays} allClubs={allClubs} />
  );
}
