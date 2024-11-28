import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";

import { Container, Typography } from "@mui/material";

import LocalUsersGrid from "components/users/LocalUsersGrid";
import { extractFirstYear } from "components/members/MembersGrid";

import { techTeamWords } from "constants/ccMembersFilterWords";

export const metadata = {
  title: "SLC Tech Team @ IIIT-H",
};

export default async function TechTeam() {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: {
      cid: "cc",
    },
  });

  const techMembers = members
    ?.map((member) => {
      const { roles } = member;
      const techTeamRoles = filterRoles(roles, techTeamWords);
      const newMember = { ...member, roles: techTeamRoles };
      return newMember;
    })
    ?.filter((member) => {
      return member.roles.length > 0;
    });

  // construct dict of { year: [members] } where each year is a key
  const targetMembers = techMembers
    ? techMembers.reduce((acc, member) => {
        const latestYear = extractFirstYear(member);
        if (!acc[latestYear]) {
          acc[latestYear] = [];
        }
        acc[latestYear].push(member);
        return acc;
      }, {})
    : {};

  return (
    <Container>
      <center>
        <Typography variant="h3" mb={4}>
          Our Perfect Visionary Crew
        </Typography>
      </center>
      {techMembers?.length ? (
        <LocalUsersGrid users={targetMembers[-1]} techMembers={true} />
      ) : (
        <center>
          <h2>No Members Found!</h2>
        </center>
      )}
    </Container>
  );
}

const filterRoles = (roles, filterWords) => {
  return roles?.filter((role) => {
    const { name } = role;
    const lowercaseName = name.toLowerCase();
    return filterWords.some((word) => lowercaseName.includes(word));
  });
};
