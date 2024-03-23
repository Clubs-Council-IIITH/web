import { getClient } from "gql/client";
import { GET_ALL_RECRUITMENTS } from "gql/queries/recruitment";

import { Container, Typography } from "@mui/material";

import CCRecruitmentsTable from "components/cc-recruitments/CCRecruitmentsTable";

export const metadata = {
  title: "CC Recruitments",
};

export default async function AllRecruitmentsApplications() {
  const { data: { ccApplications } = {} } = await getClient().query(
    GET_ALL_RECRUITMENTS
  );

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        All CC Recruitment Applications
      </Typography>

      <CCRecruitmentsTable data={ccApplications} />
    </Container>
  );
}
