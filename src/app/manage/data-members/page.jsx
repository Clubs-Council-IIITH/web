import { Container, Typography } from "@mui/material";

import DataForm from "components/members/DataForm";

export const metadata = {
  title: "Download Members data",
};

export default function DownloadMembersData() {
  // default form values
  const defaultValues = {
    clubid: "",
    allEvents: false,
  };

  return (
    <Container>
      <DataForm defaultValues={defaultValues} action="create" />
    </Container>
  );
}
