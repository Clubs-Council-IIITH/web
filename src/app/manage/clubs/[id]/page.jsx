import Link from "next/link";

import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import { Divider, Stack, Button, Box, Card, Typography } from "@mui/material";

import Icon from "components/Icon";
import ActionPalette from "components/ActionPalette";

import ClubBanner from "components/clubs/ClubBanner";
import ClubInfo from "components/clubs/ClubInfo";
import ClubSocials from "components/clubs/ClubSocials";
import { EditClub, DeleteClub } from "components/clubs/ClubActions";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query(GET_CLUB, {
    clubInput: { cid: id },
  });

  return {
    title: club.name,
  };
}

export default async function ManageClub({ params }) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query(GET_CLUB, {
    clubInput: { cid: id },
  });

  return (
    <Box>
      <ActionPalette right={[EditClub, DeleteClub]} />
      <Card variant="none" sx={{ boxShadow: 0 }}>
        <ClubBanner
          name={club.name}
          banner={club.banner}
          width={640}
          height={480}
        />
      </Card>
      <Box my={4}>
        <ClubInfo name={club.name} logo={club.logo} tagline={club.tagline} />
      </Box>
      <ClubSocials socials={club.socials} />
    </Box>
  );
}
