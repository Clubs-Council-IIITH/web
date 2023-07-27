import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";

import EventDetails from "components/events/EventDetails";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_EVENT, {
    eventid: id,
  });

  return {
    title: event.name,
  };
}

export default async function Event({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_EVENT, {
    eventid: id,
  });

  return <EventDetails event={event} />;
}
