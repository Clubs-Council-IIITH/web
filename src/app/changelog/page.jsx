import { MDXRemote } from "next-mdx-remote/rsc";

import { Container, Typography } from "@mui/material";

import Status from "./status.mdx";

import LocalUsersGrid from "components/users/LocalUsersGrid";
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Changelog",
};

export default async function Changelog() {
  const status = await fetch(getStaticFile("json/status.json"));
  const techMembers = await fetch(getStaticFile("json/techMembers.json"));
  const logs = await fetch(getStaticFile("mdx/logs.mdx"));

  return (
    <Container>
      <Typography variant="h3">Live Status</Typography>
      <Status status={await status.json()} />

      <Typography variant="h3" mt={3}>
        Maintainers
      </Typography>
      <LocalUsersGrid users={await techMembers.json()} />

      <Typography variant="h3" mt={3}>
        Changelog
      </Typography>
      <MDXRemote source={await logs.text()} />
    </Container>
  );
}
