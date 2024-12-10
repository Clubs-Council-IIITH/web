import { getClient } from "gql/client";
import { GET_FILE } from "gql/queries/storagefiles";
import { GET_USER } from "gql/queries/auth";

import { redirect } from "next/navigation";

import DocForm from "components/docs/DocForm";

export const metadata = {
  title: "Important Documents | Life @ IIIT-H",
};

export default async function Docs({ params }) {
  const { id } = params;

  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = { ...userMeta, ...userProfile };

  if (user?.role !== "cc") redirect("/404");

  const { data: { storagefile } = {} } = await getClient().query(GET_FILE, {
    fileId: id,
  });

  return <DocForm editFile={storagefile} newFile={false} />;
}
