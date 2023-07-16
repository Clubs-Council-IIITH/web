import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import { Box, Card } from "@mui/material";
import ClubBanner from "components/clubs/ClubBanner";
import ClubInfo from "components/clubs/ClubInfo";
import ClubSocials from "components/clubs/ClubSocials";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query({
    query: GET_CLUB,
    variables: {
      clubInput: { cid: id },
    },
  });

  return {
    title: club.name,
  };
}

export default async function Club({ params }) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query({
    query: GET_CLUB,
    variables: {
      clubInput: { cid: id },
    },
  });

  return (
    <Box>
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
