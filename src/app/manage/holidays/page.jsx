import { getClient, combineQuery } from "gql/client";
import { GET_HOLIDAYS } from "gql/queries/holidays";

import ManageHolidaysClient from "components/holidays/ManageHolidaysClient";

export const metadata = {
  title: "Manage Holidays",
};

export default async function ManageHolidays() {
  const { document, variables } = combineQuery('CombinedQuery')
    .add(GET_HOLIDAYS);

  const { data: { holidays } = {} } = await getClient().query(document, variables);

  return <ManageHolidaysClient holidays={holidays} />;
}
