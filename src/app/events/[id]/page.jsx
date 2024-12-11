import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";
import { notFound } from "next/navigation";
import dayjs from "dayjs";

import { shortDescription } from "app/layout";
import { getFile, PUBLIC_URL } from "utils/files";
import EventDetails, { getEventLocation } from "components/events/EventDetails";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_EVENT, {
      eventid: id,
    });
    const img = event.poster
      ? getFile(event.poster, true)
      : `${PUBLIC_URL}/og-image.png`;
    const alt = event.poster ? event.name + " Poster" : "Common Poster";

    const time = dayjs(event.datetimeperiod[0]).format("dddd h A");

    return {
      title: `${event.name} | Life @ IIITH`,
      description: event.description ? event.description : shortDescription,
      openGraph: {
        title: `${event.name} (Time: ${time}, Location: ${getEventLocation(
          event
        )}) | Life @ IIITH`,
        siteName: "Life @ IIITH",
        images: [
          {
            url: img,
            secure_url: img,
            width: 256,
            height: 256,
            alt: alt,
          },
        ],
      },
    };
  } catch (error) {
    notFound();
  }
}

export default async function Event({ params }) {
  const { id } = params;

  const { data: { event } = {} } = await getClient().query(GET_EVENT, {
    eventid: id,
  });

  return <EventDetails event={event} />;
}
