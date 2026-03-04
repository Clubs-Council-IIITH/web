import { redirect } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import DocForm from "components/docs/DocForm";

export const metadata = {
  title: "Important Documents | Life @ IIIT-H",
};

export default async function Docs() {
  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_USER,
      { userInput: null });

  const { data: { userMeta, userProfile } = {} } = await getClient().query(document, variables);
  const user = { ...userMeta, ...userProfile };

  if (user?.role !== "cc") redirect("/404");

  return <DocForm />;
}
