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
      const executiveBoardRoles = filterRoles(
        roles,
        executiveBoardWords,
        techTeamWords,
      );
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
      const newWords = executiveBoardWords.concat(techTeamWords);
      const techTeamRoles = filterRoles(roles, [], newWords);
      const newMember = { ...member, roles: techTeamRoles };
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

const filterRoles = (roles, filterWords, unfilterWords = []) => {
  // Filter roles that meet the filterWords criteria and are not in the unfilterWords list
  let filteredRoles = roles?.filter((role) => {
    const { name, endYear } = role;
    const lowercaseName = name.toLowerCase();
    const matchesFilterWords = filterWords.some((word) =>
      lowercaseName.includes(word),
    );
    const matchesUnfilterWords = unfilterWords.some((word) =>
      lowercaseName.includes(word),
    );
    return matchesFilterWords && !matchesUnfilterWords && endYear === null;
  });

  // If any roles are filtered, return those that match filterWords and not unfilterWords
  if (filteredRoles?.length > 0) {
    return roles?.filter((role) => {
      const { name, endYear } = role;
      const lowercaseName = name.toLowerCase();
      const matchesFilterWords = filterWords.some((word) =>
        lowercaseName.includes(word),
      );
      const matchesUnfilterWords = unfilterWords.some((word) =>
        lowercaseName.includes(word),
      );
      return matchesFilterWords && !matchesUnfilterWords;
    });
  } else {
    return filteredRoles;
  }
};
