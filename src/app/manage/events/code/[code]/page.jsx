import { notFound, redirect } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_EVENT_ID_FROM_CODE } from "gql/queries/events";

export default async function EventByCode(props) {
  const params = await props.params;
  const { code } = params;

  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_EVENT_ID_FROM_CODE,
      {
        code,
      });

  const { data = {}, error } = await getClient().query(document, variables);

  if (error || !data?.eventid) notFound();

  redirect(`/manage/events/${data.eventid}`);
}
