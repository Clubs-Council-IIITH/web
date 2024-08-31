import { getClient } from "gql/client";
import { GET_EVENT } from "gql/queries/events";
import { redirect } from "next/navigation";
import { headers  } from 'next/headers';

import EventDetails from "components/events/EventDetails";

export async function generateMetadata({ params }, parent) {
  const { id } = params;
  const headersList = headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  try {
    const { data: { event } = {} } = await getClient().query(GET_EVENT, {
      eventid: id,
    });
    const posterUrl = event.poster
      ? `${protocol}://${host}/files/download?filename=${encodeURIComponent(event.poster)}&w=1080&q=75`
      : `https://clubs.iiit.ac.in/assets/cc-logo-full-color.svg`;

    return {
      title: event.name,
      openGraph: {
        images: [
          {
            url: posterUrl,
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
