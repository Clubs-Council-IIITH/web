import {getClient} from "gql/client";
import {GET_USER} from "gql/queries/auth";
import {notFound} from "next/navigation";
import BulkAddForm from "components/members/BulkAddForm";

export const metadata = {
  title: "Bulk Edit",
};

export default async function BulkEditPage() {
  const { data: { userMeta } = {} } = await getClient().query(
    GET_USER,
    { userInput: null },
  );
  const user = userMeta;

  if (user?.role !== "cc" && user?.role !== "club") {
    notFound();
  }

  return <BulkAddForm/>;
}