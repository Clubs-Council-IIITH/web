import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { permanentRedirect, notFound } from "next/navigation";

import { Box } from "@mui/material";

import MembersGrid from "components/members/MembersGrid";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  let club;

  try {
    const { data: { club: fetchedClub } = {} } = await getClient().query(
      GET_CLUB,
      {
        clubInput: { cid: id },
      },
    );

    club = fetchedClub;
  } catch (error) {
    notFound();
    return;
  }

  if (club?.studentBody)
    return permanentRedirect(`/student-bodies/${id}/members`);

  return {
    title: `Members | ${club.name}`,
  };
}

export default function ClubMembers({ params }) {
  const { id } = params;

  return (
    <Box>
      <MembersGrid clubid={id} />
    </Box>
  );
}
