import { Container } from "@mui/material";

import Content from "./content.mdx";

import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Supervisory Bodies",
};

export default async function SupervisoryBodies() {
  const sacMembers = await fetch(getStaticFile("json/sacMembers.json"));
  const slcMembers = await fetch(getStaticFile("json/slcMembers.json"));
  const sloMembers = await fetch(getStaticFile("json/sloMembers.json"));

  return (
    <Container>
      <Content
        sacMembers={await sacMembers.json()}
        slcMembers={await slcMembers.json()}
        sloMembers={await sloMembers.json()}
      />
    </Container>
  );
}
