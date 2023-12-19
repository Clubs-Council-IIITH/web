import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

import FullCalendar from "components/Calendar";

export const metadata = {
  title: "Calendar",
};

export default async function Calendar() {
  const { data: { events } = {} } = await getClient().query(GET_ALL_EVENTS, {
    clubid: null,
    paginationOn: false,
  });

  // TODO: Paginate this also

  return <FullCalendar events={events} />;
}
