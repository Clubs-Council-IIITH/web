import { Box, Card } from "@mui/material";

import { getClub, getUserProfile } from "utils/fetchData";

import ActionPalette from "components/ActionPalette";
import ClubBanner from "components/clubs/ClubBanner";
import ClubInfo from "components/clubs/ClubInfo";
import ClubSocials from "components/clubs/ClubSocials";
import {
  EditClub,
  DeleteClub,
  UnDeleteClub,
} from "components/clubs/ClubActions";

export async function generateMetadata({ params }) {
  const { id } = params;

  const user = await getUserProfile(null);
  const club = await getClub(
    id === encodeURIComponent("~mine") ? user.uid : id,
  );

  return {
    title: club.name,
  };
}

export default async function ManageClub(props) {
  const params = await props.params;
  const { id } = params;

  const user = await getUserProfile(null);
  const club = await getClub(
    id === encodeURIComponent("~mine") ? user.uid : id,
  );

  return (
    <Box>
      <ActionPalette right={getActions(club, user)} />
      <Card variant="none" sx={{ boxShadow: 0 }}>
        <ClubBanner
          name={club.name}
          banner={club.banner}
          width={640}
          height={480}
        />
      </Card>
      <Box sx={{
        my: 4
      }}>
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
