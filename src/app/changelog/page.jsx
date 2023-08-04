import { Container, Typography } from "@mui/material";

import Status from "./status.mdx";
import Logs from "./logs.mdx";

import techMembers from "app/about/clubs-council/techMembers.json";

import LocalUsersGrid from "components/users/LocalUsersGrid";

export const metadata = {
  title: "Changelog",
};

export default function Changelog() {
  return (
    <Container>
      <Typography variant="h3">Live Status</Typography>
      <Status />

      <Typography variant="h3" mt={3}>
        Maintainers
      </Typography>
      <LocalUsersGrid users={techMembers} />

      <Typography variant="h3" mt={3}>
        Changelog
      </Typography>
      <Logs />
    </Container>
  );
}
