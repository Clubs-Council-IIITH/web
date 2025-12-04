import { permanentRedirect } from "next/navigation";
import { Box } from "@mui/material";

import { getClub } from "utils/fetchData";

import MembersGrid from "components/members/MembersGrid";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const club = await getClub(id);
  if (club?.category == "body")
    return permanentRedirect(`/student-bodies/${id}/members`);

  return {
    title: `Members | ${club.name}`,
  };
}

export default async function ClubMembers(props) {
  const params = await props.params;
  const { id } = params;

  return (
    <Box>
      <MembersGrid clubid={id} />
    </Box>
  );
}
