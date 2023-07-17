import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import EventPoster from "./EventPoster";

export default async function EventFallbackPoster({
  name,
  clubid,
  width,
  height,
}) {
  const { data: { club } = {} } = await getClient().query({
    query: GET_CLUB,
    variables: {
      clubInput: { cid: clubid },
    },
  });

  return (
    <EventPoster
      name={name}
      poster={club.banner}
      width={width}
      height={height}
    />
  );
}
