import { Container } from "@mui/material";

import Content from "./content.mdx";

import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Supervisory Bodies @ IIIT-H",
};

export default async function SupervisoryBodies() {
  const sacMembers = await fetch(getStaticFile("sacMembers.json"), {
    next: { revalidate: 40 * 60 }, // 40 minutes
  });
  const slcMembers = await fetch(getStaticFile("slcMembers.json"), {
    next: { revalidate: 40 * 60 }, // 40 minutes
  });
  const sloMembers = await fetch(getStaticFile("sloMembers.json"), {
    next: { revalidate: 40 * 60 }, // 40 minutes
  });

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
