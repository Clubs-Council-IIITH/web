import { notFound, redirect } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";

export default async function Profile() {
  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_USER, {
      userInput: null
    });

  const { data: { userMeta, userProfile } = {} } = await getClient().query(document, variables);
  const user = { ...userMeta, ...userProfile };

  if (user.uid == null) {
    notFound();
  }

  // redirect to user's profile page
  redirect(`/profile/${user.uid}`);
}
