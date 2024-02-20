import { redirect } from "next/navigation";

import { getClient } from "gql/client";
import { GET_EVENT_ID_FROM_CODE } from "gql/queries/events";

export default async function EventByCode({ params }) {
  const { code } = params;

  const { data = {}, error } = await getClient().query(
    GET_EVENT_ID_FROM_CODE,
    { code },
  );
  if (error || !data?.eventid)
    redirect("/404");

  redirect(`/manage/events/${data.eventid}`);
}
