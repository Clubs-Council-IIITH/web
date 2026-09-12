import { Button, Container, Stack, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

import ClubsTable from "components/clubs/ClubsTable";
import Icon from "components/Icon";
import ButtonLink from "components/Link";

import {
  clubCategories,
  studentBodyCategories,
  supervisoryBodyCategories,
} from "constants/clubCategories";

export const metadata = {
  title: "Manage Clubs",
};

export default async function ManageClubs() {
  const { document, variables } = combineQuery("CombinedManageClubs")
    .add(GET_ALL_CLUBS)
    .add(GET_USER, { userInput: null });

  const { data = {} } = await getClient().query(document, variables);
  const { allClubs: clubs = [], userMeta } = data;

  const isSlo = userMeta?.role === "slo";

  const clubsList = clubs.filter((club) =>
    clubCategories.includes(club.category),
  );
  const studentBodiesList = clubs.filter((club) =>
    studentBodyCategories.includes(club.category),
  );
  const supervisoryBodiesList = clubs.filter((club) =>
    supervisoryBodyCategories.includes(club.category),
  );

  const sections = isSlo
    ? [
        { title: "Supervisory Bodies", clubs: supervisoryBodiesList },
        { title: "Student Bodies", clubs: studentBodiesList },
        { title: "Clubs", clubs: clubsList },
      ]
    : [
        { title: "Clubs", clubs: clubsList },
        { title: "Student Bodies", clubs: studentBodiesList },
        { title: "Supervisory Bodies", clubs: supervisoryBodiesList },
      ];

  return (
    <Container>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Manage Clubs & Student Bodies
        </Typography>

        <Button
          component={ButtonLink}
          href="/manage/clubs/new"
          variant="contained"
          startIcon={<Icon variant="add" />}
        >
          New Club/Body
        </Button>
      </Stack>

      {sections.map(({ title, clubs: tableClubs }, index) => (
        <Stack key={title} sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mt: index !== 0 ? 2 : 0,
            }}
          >
            {title}
          </Typography>
          <ClubsTable clubs={tableClubs} />
        </Stack>
      ))}
    </Container>
  );
}
