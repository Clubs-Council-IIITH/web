import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";

import { Container } from "@mui/material";

import Content from "./content.mdx";
import LocalUsersGrid from "components/users/LocalUsersGrid";

import {
  executiveBoardWords,
  techTeamWords,
} from "constants/ccMembersFilterWords";

export const metadata = {
  title: "Clubs Council",
};

export default async function ClubsCouncil() {
  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: {
      cid: "cc",
    },
  });

  const executiveMembers = members
    ?.map((member) => {
      const { roles } = member;
      const executiveBoardRoles = filterRoles(roles, executiveBoardWords);
      const newMember = { ...member, roles: executiveBoardRoles };
      return newMember;
    })
    ?.filter((member) => {
      return member.roles.length > 0;
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

  const extendedMembers = members
    ?.map((member) => {
      const { roles } = member;
      const extendedRoles = roles?.filter((role) => {
        const { name, endYear } = role;
        if (endYear !== null) return false;
        return (
          !executiveBoardWords.some((word) =>
            name.toLowerCase().includes(word)
          ) && !techTeamWords.some((word) => name.toLowerCase().includes(word))
        );
      });

      const newMember = { ...member, roles: extendedRoles };
      return newMember;
    })
    ?.filter((member) => {
      return member.roles.length > 0;
    });

  return (
    <Container>
      <Content
        ccMembers={
          executiveMembers?.length ? (
            <LocalUsersGrid users={executiveMembers} />
          ) : null
        }
        techMembers={
          techMembers?.length ? <LocalUsersGrid users={techMembers} /> : null
        }
        extendedMembers={
          extendedMembers?.length ? (
            <LocalUsersGrid users={extendedMembers} />
          ) : null
        }
      />
    </Container>
  );
}

const filterRoles = (roles, filterWords) => {
  let filteredRoles = roles?.filter((role) => {
    const { name, endYear } = role;
    const lowercaseName = name.toLowerCase();
    return filterWords.some(
      (word) => lowercaseName.includes(word) && endYear === null
    );
  });
  if (filteredRoles?.length > 0)
    return roles?.filter((role) => {
      const { name, endYear } = role;
      const lowercaseName = name.toLowerCase();
      return filterWords.some((word) => lowercaseName.includes(word));
    });
  else return filteredRoles;
};
