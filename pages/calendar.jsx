import stc from "string-to-color";

import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { GET_ALL_EVENTS } from "gql/queries/events.jsx";

import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";

import { Card, Container } from "@mui/material";
import Page from "components/Page";

function transformEventDetails(event) {
  return {
    id: event._id,
    clubid: event.clubid,
    title: event.name,
    startDate: event.datetimeperiod[0],
    endDate: event.datetimeperiod[1],
  };
}

const Appointment = ({ children, style, ...restProps }) => {
  const router = useRouter();

  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: stc(restProps.data.clubid),
      }}
      onClick={() => router.push(`/events/${restProps.data.id}`)}
    >
      {children}
    </Appointments.Appointment>
  );
};

export default function Calendar() {
  const { data: { events } = {}, loading } = useQuery(GET_ALL_EVENTS, {
    variables: {
      clubid: null,
    },
  });

  return loading ? null : (
    <Page title="Calendar">
      <Container>
        <Card variant="outlined" sx={{ p: 1 }}>
          <Scheduler
            data={events?.filter((e) => e?.status?.state !== "deleted")?.map(transformEventDetails)}
          >
            <ViewState defaultCurrentDate={new Date().toISOString()} />
            <MonthView />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <Appointments appointmentComponent={Appointment} />
          </Scheduler>
        </Card>
      </Container>
    </Page>
  );
}
