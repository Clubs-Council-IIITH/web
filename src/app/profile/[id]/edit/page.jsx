import { redirect, notFound } from "next/navigation";

import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Container } from "@mui/material";

import UserForm from "components/profile/UserForm";

export const metadata = {
  title: "Edit Profile",
};

export default async function EditProfile({ params }) {
  const { id } = params;

  try {
    // get target user
    const { data: { userProfile, userMeta } = {} } = await getClient().query(
      GET_USER_PROFILE,
      {
        userInput: {
          uid: id,
        },
      },
    );
    const user = { ...userMeta, ...userProfile };

    if (userProfile === null || userMeta === null) {
      notFound();
    }
    // console.log(user);

    // if user is a club, redirect to club edit page
    if (user.role === "club") {
      redirect(`/manage/clubs/${user.uid}/edit`);
    }

    return (
      <Container>
        <UserForm defaultValues={user} action="save" />
      </Container>
    );
  } catch (error) {
    redirect("/404");
  }
}
