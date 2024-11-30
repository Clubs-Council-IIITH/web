import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";

import { Container, Typography, Grid } from "@mui/material";

import LocalUsersGrid from "components/users/LocalUsersGrid";
import { extractFirstYear } from "components/members/MembersGrid";
import SLCTechLogo from "components/SLCTechLogo";

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
      <Grid
        container
        display="flex"
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{
          width: "100%",
          padding: 2.5,
        }}
      >
        <SLCTechLogo height={120} width={300} />
      </Grid>

      <Typography variant="h3" mb={2}>
        About Us
      </Typography>

      <Typography variant="body">
        The SLC-CC Tech Team started as the CC Tech Team with a clear mission:
        to design and maintain the official Clubs Council website. Since the
        release of <i>Version 1 in 2021</i>, we've grown into a dedicated
        technical powerhouse serving all clubs and student bodies across the
        institution.
      </Typography>

      <Typography variant="h5" mb={2} mt={2}>
        Who are we?
      </Typography>

      <Typography variant="body">
        We're a passionate team committed to empowering our institution through
        technology. From crafting dynamic websites to managing critical systems,
        we strive to ensure seamless digital experiences for the student
        community.
      </Typography>

      <Typography variant="h5" mb={2} mt={2}>
        What We Do
      </Typography>

      <Typography variant="body">
        Our work spans a wide range of technical services, including:
      </Typography>

      <Typography variant="body" component="ul" sx={{ marginLeft: 2 }}>
        <li>
          Developing and maintaining websites for the Clubs Council and various
          student bodies, such as NSS, Cultural Council, CLC, and the Sports
          Council.
        </li>
        <li>
          Providing systems and server support to ensure the smooth functioning
          of student activities and operations.
        </li>
        <li>
          Collaborating with the institute's IT department to maintain essential
          infrastructure and resolve technical challenges.
        </li>
      </Typography>

      <Typography variant="h5" mb={2} mt={2}>
        Our Projects
      </Typography>
      <Typography variant="body" paragraph>
        Here are some of the websites we've developed and currently maintain:
      </Typography>
      <Typography variant="body" component="ul" sx={{ marginLeft: 2 }}>
        <li>Life Website</li>
        <li>Clubs Council Website</li>
        <li>
          Websites for NSS, Cultural Council, CLC, and other student bodies
        </li>
      </Typography>

      <Typography variant="body1" paragraph mt={3}>
        With each project, we aim to uphold our core values of innovation,
        reliability, and teamwork. Together, we're shaping the future of our
        institution's digital landscape.
      </Typography>

      <Typography variant="h3" mb={4} mt={5}>
        Our Perfect Visionary Crew
      </Typography>
      {techMembers?.length ? (
        <LocalUsersGrid users={targetMembers[-1]} techMembers={true} />
      ) : (
        <center>
          <h2>No Members Found!</h2>
        </center>
      )}

      {/* Reach out to us at webadmin@students.iiit.ac.in */}

      <Typography variant="h3" mb={2} mt={5}>
        Reach Out to Us
      </Typography>
      <Typography variant="body1" paragraph>
        For any queries, suggestions, or collaborations, feel free to reach out
        to us at{" "}
        <a href="mailto:webadmin@students.iiit.ac.in" target="_blank">
          webadmin@students.iiit.ac.in
        </a>
        .
      </Typography>
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
