import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { redirect } from "next/navigation";

import { Box, Card } from "@mui/material";

import ActionPalette from "components/ActionPalette";

import ClubBanner from "components/clubs/ClubBanner";
import ClubInfo from "components/clubs/ClubInfo";
import ClubSocials from "components/clubs/ClubSocials";
import { EditClub, DeleteClub, UnDeleteClub } from "components/clubs/ClubActions";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  try {
    const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
      userInput: null,
    });

    const { data: { club } = {} } = await getClient().query(GET_CLUB, {
      clubInput: {
        cid: id === encodeURIComponent("~mine") ? userMeta.uid : id,
      },
    });

    return {
      title: club.name,
    };
  } catch (error) {
    redirect("/404");
  }
}

export default async function ManageClub({ params }) {
  const { id } = params;

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );

  const { data: { club } = {} } = await getClient().query(GET_CLUB, {
    clubInput: { cid: id === encodeURIComponent("~mine") ? userMeta.uid : id },
  });

  return (
    <Box>
      <ActionPalette
        right={getActions(club, { ...userMeta, ...userProfile })}
      />
      <Card variant="none" sx={{ boxShadow: 0 }}>
        <ClubBanner
          name={club.name}
          banner={club.banner}
          width={640}
          height={480}
        />
      </Card>
      <Box my={4}>
        <ClubInfo
          name={club.name}
          logo={club.logo}
          tagline={club.tagline}
          description={club.description}
        />
      </Box>
      <ClubSocials socials={club.socials} email={club.email} />
    </Box>
  );
}

// set conditional actions based on club status and user role
function getActions(club, user) {
  /*
   * Deleted - nothing
   */
  if (club?.state === "deleted") {
    return [UnDeleteClub];
  }

  /*
   * Club - edit
   */
  if (user?.role === "club") {
    return [EditClub];
  }

  /*
   * CC - edit, delete
   */
  if (user?.role === "cc") {
    return [EditClub, DeleteClub];
  }
}
