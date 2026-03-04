import { notFound } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import BulkEditForm from "components/members/BulkEditForm";

export const metadata = {
  title: "Bulk Edit",
};

export default async function BulkEditPage() {
  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_USER, {
      userInput: null,
    });

  const { data: { userMeta } = {} } = await getClient().query(document, variables);
  const user = userMeta;

  if (user?.role !== "cc" && user?.role !== "club") {
    notFound();
  }

  return <BulkEditForm mode="edit" />;
}
