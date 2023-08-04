import { Container } from "@mui/material";

import Content from "./content.mdx";

import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Clubs Council",
};

export default async function ClubsCouncil() {
  const ccMembers = await fetch(getStaticFile("json/ccMembers.json"), {
    next: { revalidate: 60 },
  });
  const techMembers = await fetch(getStaticFile("json/techMembers.json"), {
    next: { revalidate: 60 },
  });
  const extendedMembers = await fetch(
    getStaticFile("json/extendedMembers.json"),
    {
      next: { revalidate: 60 },
    }
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
