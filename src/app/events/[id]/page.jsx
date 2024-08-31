import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";
import { redirect } from "next/navigation";

import { getFile } from "utils/files";
import { getPlaceholder } from "utils/placeholder";
import EventDetails from "components/events/EventDetails";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_EVENT, {
      eventid: id,
    });
    const img = event.poster
      ? getFile(event.poster)
      : getPlaceholder({ seed: event.name, w: 2000, h: 2000 })

    return {
      title: event.name,
      openGraph: {
        images: [
          {
            url: img,
            width: 256,
            height: 256,
            alt: event.name,
          },
        ],
      },
    };
  } catch (error) {
    return redirect("/404");
  }
}

export default async function Event({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_EVENT, {
    eventid: id,
  });

  return <EventDetails event={event} />;
}
