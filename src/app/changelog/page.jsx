import { getClient } from "gql/client";
import { GET_MEMBERS } from "gql/queries/members";
import { getNginxFile } from "utils/files";

import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container, Box, Typography, Stack, Button } from "@mui/material";

import Icon from "components/Icon";
import LocalUsersGrid from "components/users/LocalUsersGrid";
import { techTeamWords } from "constants/ccMembersFilterWords";

import Status from "./status.mdx";

const limit = 20;

export const metadata = {
  title: "Changelog | Clubs Council @ IIIT-H",
};

export default async function Changelog({ searchParams }) {
  const show_all = searchParams?.all === "true" ? true : false;

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
    })
    ?.sort((a, b) => {
      const roleNameA = a.roles[0]?.name.toLowerCase();
      const roleNameB = b.roles[0]?.name.toLowerCase();
      if (roleNameA.includes("lead") && !roleNameB.includes("lead")) {
        return -1;
      }
      if (roleNameB.includes("lead") && !roleNameA.includes("lead")) {
        return 1;
      }
      if (roleNameA.includes("advisor") && !roleNameB.includes("advisor")) {
        return 1;
      }
      if (roleNameB.includes("advisor") && !roleNameA.includes("advisor")) {
        return -1;
      }

      return 0;
    });

  const status = await fetch(getNginxFile("json/status.json"), {
    next: { revalidate: 10 * 60 }, // 10 minutes
  });
  const logs = await fetch(getNginxFile("mdx/logs.mdx"), {
    next: { revalidate: 10 * 60 }, // 10 minutes
  });

  let logsText = await logs.text();

  return (
    <Container>
      <Typography variant="h3">Status</Typography>
      <Box
        sx={{
          "& a": {
            color: "text.link",
          },
        }}
      >
        <Status
          status={await status.json()}
          version={2}
          firstRelease={"April 2023"}
        />
      </Box>

      <Stack direction="row" pt={2} mb={2} mt={3}>
        <Typography variant="h3" mt={3}>
          Maintainers
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="none"
          color="secondary"
          component={Link}
          href="/about/clubs-council/tech-members"
        >
          <Typography variant="button" color="text.primary">
            View all
          </Typography>
          <Icon variant="chevron-right" />
        </Button>
      </Stack>
      {techMembers?.length ? <LocalUsersGrid users={techMembers} /> : null}

      <Stack direction="row" pt={2} mb={2} mt={3}>
        <Typography variant="h3">Changelog</Typography>
        {logsText.split("\n").length > limit ? (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Box display="flex" alignItems="center">
              {show_all ? (
                <Button
                  variant="none"
                  color="secondary"
                  component={Link}
                  href="/changelog"
                >
                  <Icon variant="chevron-left" />
                  <Typography variant="button" color="text.primary">
                    View less
                  </Typography>
                </Button>
              ) : (
                <Button
                  variant="none"
                  color="secondary"
                  component={Link}
                  href="/changelog?all=true"
                >
                  <Typography variant="button" color="text.primary">
                    View all
                  </Typography>
                  <Icon variant="chevron-right" />
                </Button>
              )}
            </Box>
          </>
        ) : null}
      </Stack>

      <MDXRemote
        source={
          show_all ? logsText : logsText?.split("\n").slice(0, limit).join("\n")
        }
      />

      {logsText.split("\n").length > limit ? (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Showing {show_all ? logsText?.split("\n").length : limit} of{" "}
          {logsText?.split("\n").length} entries.
        </Typography>
      ) : null}
    </Container>
  );
}

const filterRoles = (roles, filterWords) => {
  let filteredRoles = roles?.filter((role) => {
    const { name, endYear } = role;
    const lowercaseName = name.toLowerCase();
    return filterWords.some(
      (word) => lowercaseName.includes(word) && endYear === null,
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
