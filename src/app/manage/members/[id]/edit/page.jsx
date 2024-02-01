import { getClient } from "gql/client";
import { GET_MEMBER } from "gql/queries/members";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import MemberForm from "components/members/MemberForm";

export const metadata = {
  title: "Edit Member",
};

function transformMember(member) {
  return {
    ...member,
    roles:
      member?.roles?.map((role, key) => ({
        ...role,
        id: role?.rid || key,
      })) || [],
  };
}

export default async function EditMember({ params }) {
  const { id } = params;

  try {
    const { data: { member } = {} } = await getClient().query(GET_MEMBER, {
      memberInput: {
        cid: id?.split(encodeURIComponent(":"))[0],
        uid: id?.split(encodeURIComponent(":"))[1],
        rid: null,
      },
      userInput: {
        uid: id?.split(encodeURIComponent(":"))[1],
      },
    });
  } catch (error) {
    redirect("/404");
  }


  return (
    <Container>
      <Typography variant="h3" gutterBottom mb={3}>
        Edit Member Details
      </Typography>

      <MemberForm defaultValues={transformMember(member)} action="edit" />
    </Container>
  );
}
