import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_FILES } from "gql/queries/storagefiles";

import DocsList from "components/docs/DocsList";

export const metadata = {
  title: "Important Documents | Life @ IIIT-H",
};

export default async function Docs() {
  const { document, variables } = combineQuery("CombinedQuery")
    .add(GET_ALL_FILES, { filetype: "pdf" })
    .add(GET_USER, { userInput: null });

  const { data: { storagefiles, userMeta, userProfile } = {} } =
    await getClient().query(document, variables);

  const user = { ...userMeta, ...userProfile };
  const isPriviliged = user?.role == "cc" ? true : false;

  return <DocsList allFiles={storagefiles} priviliged={isPriviliged} />;
}
