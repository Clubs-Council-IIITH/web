import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";

import { Grid } from "@mui/material";
import MemberCard from "components/members/MemberCard";

export const dynamic = "force-dynamic";

export default async function MembersGrid({ clubid, onlyCurrent = false }) {
  const { data: { members } = {} } = await getClient().query({
    query: GET_MEMBERS,
    skip: !clubid,
    variables: {
      clubInput: {
        cid: clubid,
      },
    },
  });

  return (
    <Grid container spacing={2}>
      {members
        ?.filter((member) =>
          onlyCurrent ? member.roles.some((r) => r.endYear === null) : true
        )
        ?.map((member) => (
          <Grid key={member.uid} item xs={12} sm={6} md={4} lg={2.4}>
            <MemberCard
              uid={member.uid}
              poc={member.poc}
              roles={member.roles}
            />
          </Grid>
        ))}
    </Grid>
  );
}
