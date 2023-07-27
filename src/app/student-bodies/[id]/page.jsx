/*
/* COPY OF `src/app/clubs/[id]/members/page.jsx`
 */

import Link from "next/link";

import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import { Divider, Stack, Button, Box, Card, Typography } from "@mui/material";

import Icon from "components/Icon";

import ClubBanner from "components/clubs/ClubBanner";
import ClubInfo from "components/clubs/ClubInfo";
import ClubSocials from "components/clubs/ClubSocials";

import EventsGrid from "components/events/EventsGrid";
import MembersGrid from "components/members/MembersGrid";

export async function generateMetadata({ params }, parent) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query(GET_CLUB, {
    clubInput: { cid: id },
  });

  return {
    title: club.name,
  };
}

export default async function Club({ params }) {
  const { id } = params;

  const { data: { club } = {} } = await getClient().query(GET_CLUB, {
    clubInput: { cid: id },
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

      <Divider sx={{ borderStyle: "dashed", mt: 3 }} />

      <Stack direction="column" mx={2}>
        <Box my={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
              <Icon variant="local-activity-outline-rounded" mr={1} />
              <Typography variant="h4">Events</Typography>
            </Box>
            <Button
              variant="none"
              color="secondary"
              component={Link}
              href={`/events?club=${id}`}
            >
              <Typography variant="button" color="text.primary">
                View all
              </Typography>
              <Icon variant="chevron-right" />
            </Button>
          </Box>
          <EventsGrid type="club" clubid={id} limit={4} />
        </Box>

        <Box my={4}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
              <Icon variant="group-outline-rounded" mr={1} />
              <Typography variant="h4">Members</Typography>
            </Box>
            <Button
              variant="none"
              color="secondary"
              component={Link}
              href={`/clubs/${id}/members`}
            >
              <Typography variant="button" color="text.primary">
                View all
              </Typography>
              <Icon variant="chevron-right" />
            </Button>
          </Box>
          <MembersGrid onlyCurrent clubid={id} />
        </Box>
      </Stack>
    </Box>
  );
}
