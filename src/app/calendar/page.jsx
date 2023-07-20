import { getClient } from "gql/client";
import { GET_ALL_EVENTS } from "gql/queries/events";

import FullCalendar from "components/Calendar";

export const metadata = {
  title: "Calendar",
};

export default async function Calendar() {
  const { data: { events } = {} } = await getClient().query({
    query: GET_ALL_EVENTS,
    variables: {
      clubid: null,
    },
  });

  return <FullCalendar events={events} />;
}
