import { getClient } from "gql/client";
import { GET_ALL_RECRUITMENTS } from "gql/queries/recruitment";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Container, Typography } from "@mui/material";

import CCRecruitmentsTable from "components/cc-recruitments/CCRecruitmentsTable";

export const metadata = {
  title: "CC Recruitments",
};

export default async function AllRecruitmentsApplications() {
  const { data: { ccApplications } = {} } =
    await getClient().query(GET_ALL_RECRUITMENTS);

  const userPromises = [];
  ccApplications?.forEach((applicant) => {
    userPromises.push(
      getClient()
        .query(GET_USER_PROFILE, {
          userInput: {
            uid: applicant.uid,
          },
        })
        .toPromise(),
    );
  });
  const users = await Promise.all(userPromises);
  const processedApplicants = ccApplications.map((applicant, index) => ({
    ...applicant,
    ...users[index].data.userProfile,
    ...users[index].data.userMeta,
  }));

  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        All CC Recruitment Applications
      </Typography>

      <CCRecruitmentsTable data={processedApplicants} />
    </Container>
  );
}
