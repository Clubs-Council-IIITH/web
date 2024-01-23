import { MDXRemote } from "next-mdx-remote/rsc";

import { Container, Box, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import Icon from "components/Icon";

import Status from "./status.mdx";

import LocalUsersGrid from "components/users/LocalUsersGrid";
import { getStaticFile } from "utils/files";

const limit = 20;

export const metadata = {
  title: "Changelog",
};

export default async function Changelog({ searchParams }) {
  const show_all = searchParams?.all === "true" ? true : false;

  const status = await fetch(getStaticFile("json/status.json"), {
    cache: "no-store",
  });
  const logs = await fetch(getStaticFile("mdx/logs.mdx"), {
    cache: "no-store",
  });
  const techMembers = await fetch(getStaticFile("json/techMembers.json"), {
    next: { revalidate: 60 },
  });

  let logsText = await logs.text();

  return (
    <Container>
      <Typography variant="h3">Status</Typography>
      <Status status={await status.json()} />

      <Typography variant="h3" mt={3}>
        Maintainers
      </Typography>
      <LocalUsersGrid users={await techMembers.json()} />

      <Stack direction="row" pt={2} mb={2} mt={3}>
        <Typography variant="h3">Changelog</Typography>
        {logsText.split("\n").length > limit ? <>
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
            )
            }
          </Box>
        </> : null}
      </Stack>

      <MDXRemote source={show_all ? logsText : logsText?.split("\n").slice(0, limit).join("\n")} />

      {logsText.split("\n").length > limit ? (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Showing {show_all ? logsText?.split("\n").length : limit} of {logsText?.split("\n").length} entries.
        </Typography>
      ) : null}

    </Container>
  );
}
