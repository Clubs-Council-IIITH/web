import { Grid } from "@mui/material";
import MemberCard from "components/members/MemberCard";
import TechMemberCard from "components/members/TechMemberCard";

export default async function LocalUsersGrid({ users, techMembers = false }) {
  return (
    <Grid container spacing={techMembers ? 4 : 2} mb={3}>
      {users?.map((member) => (
        <>
          {techMembers ? (
            <Grid key={member.uid} item xs={12} md={6} lg={6}>
              <TechMemberCard
                uid={member.uid}
                poc={member.poc}
                roles={member.roles}
              />
            </Grid>
          ) : (
            <Grid key={member.uid} item xs={12} sm={6} md={4} lg={2.4}>
              <MemberCard
                uid={member.uid}
                poc={member.poc}
                roles={member.roles}
              />
            </Grid>
          )}
        </>
      ))}
    </Grid>
  );
}
