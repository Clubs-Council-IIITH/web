import { Container, Typography } from "@mui/material";

import DataForm from "components/events/DataForm";

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

      <DataForm defaultValues={defaultValues} action="create" />
    </Container>
  );
}
