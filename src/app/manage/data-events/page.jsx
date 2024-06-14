import { Container, Typography } from "@mui/material";

import ReportForm from "components/events/ReportForm";

export const metadata = {
  title: "Download Events data",
};

export default function DownloadEventsData() {
  // default form values
  const defaultValues = {
    clubid: "",
    name: "",
    datetimeperiod: [null, null],
    description: "",
    audience: [],
    poster: "",
    budget: [],
    mode: "online",
    link: "",
    location: [],
    population: 0,
    additional: "",
    equipment: "",
    poc: "",
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Download Events Data
      </Typography>

      <ReportForm defaultValues={defaultValues} action="create" />
    </Container>
  );
}
