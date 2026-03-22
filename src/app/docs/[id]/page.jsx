import { redirect } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_FILE } from "gql/queries/storagefiles";

import DocForm from "components/docs/DocForm";

export const metadata = {
  title: "Important Documents | Life @ IIIT-H",
};

export default async function Docs(props) {
  const params = await props.params;
  const { id } = params;

  // using graphQl-combine to merge get_user and get_file requests
  const { document, variables } = combineQuery('CombinedDocDetailsQuery')
    .add(GET_USER, { userInput: null })
    .add(GET_FILE, { fileId: id });

  const { data: { userMeta, userProfile, storagefile } = {} } = await getClient().query(document, variables);

  const user = { ...userMeta, ...userProfile };

  if (user?.role !== "cc") redirect("/404");

  return <DocForm editFile={storagefile} newFile={false} />;
}
