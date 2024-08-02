import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_MEMBERS } from "gql/queries/members";
import { GET_EVENT_STATUS } from "gql/queries/events";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { techTeamWords } from "constants/ccMembersFilterWords";
import { extractFirstYear } from "components/members/MembersGrid";
import EventApproveForm from "components/events/EventApproveForm";

export const metadata = {
  title: "Approve Event | CC",
};

export default async function ApproveEventCC({ params }) {
  const { id } = params;
  const { data: { event } = {} } = await getClient().query(GET_EVENT_STATUS, {
    eventid: id,
  });
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  const { data: { members } = {} } = await getClient().query(GET_MEMBERS, {
    clubInput: {
      cid: "cc",
    },
  });

  const ccMembers = members
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
  const currentccMembers = ccMembers
    ? ccMembers.filter((member) => {
        const latestYear = extractFirstYear(member);
        if (latestYear === -1) {
          return true;
        }
        return false;
      })
    : [];

  return (
    user?.role !== "cc" && redirect("/404"),
    event?.status?.state !== "pending_cc" && redirect("/404"),
    (
      <Container>
        <center>
          <Typography variant="h3" gutterBottom mb={3}>
            Approve Event | Clubs Council
          </Typography>
        </center>

        <EventApproveForm eventid={event._id} members={currentccMembers} />
      </Container>
    )
  );
}

const filterRoles = (roles, filterWords) => {
  return roles?.filter((role) => {
    const { name } = role;
    const lowercaseName = name.toLowerCase();
    return !filterWords.some((word) => lowercaseName.includes(word));
  });
};
