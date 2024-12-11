import { getClient } from "gql/client";
import { GET_EVENT_REPORT, GET_FULL_EVENT } from "gql/queries/events";
import { getFullUser } from "actions/users/get/full/server_action";
import { EventReportDetails } from "components/events/EventReportDetails";
import { GET_USER } from "gql/queries/auth";
import { redirect } from "next/navigation";

export default async function EventReport({ params }) {
  const { id } = params;

  try{
    const { data: { event } = {} } = await getClient().query(GET_FULL_EVENT, {
      eventid: id,
    });

    const { data: { userMeta, userProfile } = {} } = await getClient().query(
      GET_USER,
      { userInput: null },
    );
    const user = { ...userMeta, ...userProfile };
    if (user?.role === "club" && user?.uid !== event?.clubid) {
      return redirect("/404");
    }

    if (!event || !event?.eventReportSubmitted) {
      return redirect("/404");
    }

    const { data: { eventReport } = {} } = await getClient().query(GET_EVENT_REPORT, {
      eventid: id,
    });


    const submittedUserProfile = await getFullUser(eventReport?.submittedBy);
    if(!submittedUserProfile || !eventReport) {
      return redirect("/404");
    }

  return <EventReportDetails event={event} eventReport={eventReport} submittedUser={submittedUserProfile}/>;
  } catch (error) {
    return redirect("/404");
  }
}
