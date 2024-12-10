import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";
import { notFound } from "next/navigation";

import { getFile, PUBLIC_URL } from "utils/files";
import EventDetails from "components/events/EventDetails";
import { locationMap } from "constants/events";

import dayjs from "dayjs";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data: { event } = {} } = await getClient().query(GET_EVENT, {
      eventid: id,
    });
    const img = event.poster
      ? getFile(event.poster, true)
      : `${PUBLIC_URL}/og-image.png`;

    const time = dayjs(event.datetimeperiod[0]).format("dddd h A");

    return {
      title: `${event.name} (Time: ${time}, Location: ${locationMap[event.location]})`,
      description: event.description,
      openGraph: {
        images: [
          {
            url: img,
            secure_url: img,
            width: 256,
            height: 256,
            alt: event.name,
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
