import { Container, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ITEMS_FOR_SELECTOR, GET_ALL_TRANSACTIONS } from "gql/queries/inventory";
import { GET_UNFINISHED_EVENTS } from "gql/queries/events";
import { GET_ACTIVE_CLUB_IDS } from "gql/queries/clubs";

import TransactionForm from "components/inventory/transactions/TranForm";

export const metadata = {
  title: "New Transaction",
};

export default async function NewTransactionPage() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const role = userMeta?.role;
  const clubid = role === "club" ? userMeta?.uid : undefined;

  // Run all fetches in parallel
  const [itemsRes, txRes, eventsRes, clubsRes] = await Promise.all([
    // All items available for selector (including items in storage)
    getClient().query(GET_ITEMS_FOR_SELECTOR, {}),

    // All active transactions — used for clashing-item detection
    getClient().query(GET_ALL_TRANSACTIONS, {
      hideDeleted: true,
      paginationOn: true,
      limit: 100,
    }),

    // Upcoming / unfinished events, filtered by club when user is a club role
    getClient().query(GET_UNFINISHED_EVENTS, {
      clubid: role === "club" ? clubid : null,
      public: false,
      excludeCompleted: true,
    }),

    // Clubs cc / slo can request on behalf of (a club only needs its own name)
    getClient().query(GET_ACTIVE_CLUB_IDS, {}),
  ]);

  const items = itemsRes.data?.getItems ?? [];
  const existingTransactions = txRes.data?.getTransactions ?? [];
  const clubs = clubsRes.data?.allClubs ?? [];

  // Keep only events that haven't ended yet
  const now = new Date();
  const events = (eventsRes.data?.events ?? []).filter((e) => {
    const end = e.datetimeperiod?.[1] ? new Date(e.datetimeperiod[1]) : null;
    return !end || end >= now;
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        Request Inventory Items
      </Typography>
      <TransactionForm
        items={items}
        events={events}
        clubs={clubs}
        existingTransactions={existingTransactions}
        submitLabel="Create Request"
      />
    </Container>
  );
}