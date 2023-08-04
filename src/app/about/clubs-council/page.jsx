import { Container } from "@mui/material";

import Content from "./content.mdx";

import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Clubs Council",
};

export default async function ClubsCouncil() {
  const ccMembers = await fetch(getStaticFile("json/ccMembers.json"));
  const techMembers = await fetch(getStaticFile("json/techMembers.json"));
  const extendedMembers = await fetch(
    getStaticFile("json/extendedMembers.json")
  );

  return (
    <Container>
      <Content
        ccMembers={await ccMembers.json()}
        techMembers={await techMembers.json()}
        extendedMembers={await extendedMembers.json()}
      />
    </Container>
  );
}
