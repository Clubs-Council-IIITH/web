import { Container, Typography } from "@mui/material";

import { getClient, combineQuery } from "gql/client";
import { GET_ALL_RECRUITMENTS } from "gql/queries/recruitment";
import { GET_USER_PROFILE } from "gql/queries/users";

import CCRecruitmentsTable from "components/cc-recruitments/CCRecruitmentsTable";
import YearSelector from "components/cc-recruitments/YearSelector";

export const metadata = {
  title: "CC Recruitments",
};

export default async function AllRecruitmentsApplications(props) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const year = parseInt(searchParams?.year) || currentYear;

  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_ALL_RECRUITMENTS, { year });

  const { data: { ccApplications } = {} } = await getClient().query(document, variables);

  let usersResponse = {};
  if (ccApplications && ccApplications.length > 0) {
    const { document, variables } = combineQuery('CompositeApplicantProfiles')
      .addN(
        GET_USER_PROFILE,
        ccApplications.map(applicant => ({ userInput: { uid: applicant.uid } }))
      );

    const { data = {} } = await getClient().query(document, variables);
    usersResponse = data;
  }

  const processedApplicants =
    ccApplications?.map((applicant, index) => ({
      ...applicant,
      ...usersResponse?.[`userProfile_${index}`],
      ...usersResponse?.[`userMeta_${index}`],
    })) || [];

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography variant="h3" gutterBottom>
          All CC Recruitment Applications
        </Typography>
        <YearSelector currentYear={currentYear} selectedYear={year} />
      </div>
      <CCRecruitmentsTable data={processedApplicants} year={year} />
    </Container>
  );
}
