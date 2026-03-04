import { getClient, combineQuery } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import EventPoster from "components/events/EventPoster";

export default async function EventFallbackPoster({ clubid, width, height }) {
  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_CLUB, {
      clubInput: { cid: clubid }
    });

  const { data: { club } = {} } = await getClient().query(document, variables);

  return (
    <EventPoster
      name={club.name}
      poster={club?.bannerSquare || club?.logo}
      width={width}
      height={height}
      style={{
        filter: "blur(0.3em)",
      }}
    />
  );
}
