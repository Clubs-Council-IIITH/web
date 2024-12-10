import { redirect, notFound } from "next/navigation";

import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_MEMBERSHIPS } from "gql/queries/clubs";

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


    // get memberships if user is a person
    let memberships = [];
    const {
      data: { memberRoles },
    } = await getClient().query(GET_MEMBERSHIPS, {
      uid: id,
    });

    // get list of memberRoles.roles along with member.cid
    memberships = memberRoles.reduce(
      (cv, m) => cv.concat(m.roles.map((r) => ({ ...r, cid: m.cid }))),
      [],
    );

    if ((memberships?.length === 0 && currentUser?.uid !== user.uid) || userProfile === null || userMeta === null) {
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
