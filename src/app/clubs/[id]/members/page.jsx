import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { notFound } from "next/navigation";

import { Box } from "@mui/material";

import MembersGrid from "components/members/MembersGrid";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  try {
    const { data: { club } = {} } = await getClient().query(GET_CLUB, {
      clubInput: { cid: id },
    });

    return {
      title: `Members | ${club.name}`,
    };
  } catch (error) {
    notFound();
  }
}

export default function Members({ params }) {
  const { id } = params;

  return (
    <Box>
      <MembersGrid clubid={id} />
    </Box>
  );
}
