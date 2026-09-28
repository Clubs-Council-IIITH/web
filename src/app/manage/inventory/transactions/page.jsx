import { Button, Container, Divider, Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import {
  GET_ALL_TRANSACTIONS,
  GET_FULL_ITEM,
  GET_PENDING_TRANSACTIONS,
} from "gql/queries/inventory";

import Icon from "components/Icon";
import TranTable from "components/inventory/transactions/TranTable";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Transactions",
};

// Transactions only store itemid, so item name/location for display is
// looked up per unique itemid found in the given transactions.
async function getItemMapFor(transactions) {
  const uniqueItemIds = [...new Set(transactions.map((tx) => tx.itemid).filter(Boolean))];
  const items = await Promise.all(
    uniqueItemIds.map(async (iid) => {
      const { data } = await getClient().query(GET_FULL_ITEM, { iid });
      return data?.getItem ?? null;
    }),
  );
  return items.reduce((acc, item) => {
    if (item) acc[item.iid] = item;
    return acc;
  }, {});
}

function withItemDetails(tx, itemMap, clubMap) {
  const item = itemMap[tx.itemid];
  return {
    ...tx,
    itemName: item?.name,
    itemCode: item?.iid,
    itemClubName: item?.clubid ? clubMap[item.clubid] || item.clubid : null,
  };
}

async function getalltransactionsquery(querystring) {
  "use server";

  const { data = {}, error } = await getClient().query(GET_ALL_TRANSACTIONS, {
    clubid: querystring["targetClub"],
    pastTransactionsLimit: querystring["pastTransactionsLimit"],
    hideDeleted: querystring["hideDeleted"],
  });

  if (error) {
    console.error(error);
    return [];
  }

  const { data: { allClubs = [] } = {} } = await getClient().query(GET_ALL_CLUB_IDS, {});
  const clubMap = (allClubs || []).reduce((acc, club) => {
    if (club.cid) acc[club.cid] = club.name;
    if (club._id) acc[club._id] = club.name;
    return acc;
  }, {});
  const itemMap = await getItemMapFor(data?.getTransactions || []);

  return (data?.getTransactions || []).map((tx) => ({
    ...withItemDetails(tx, itemMap, clubMap),
    clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "SLO",
  }));
}

export default async function ManageTransactions() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const role = userMeta?.role;
  const clubid = role === "club" ? userMeta?.uid : undefined;

  const { data: { allClubs = [] } = {} } = await getClient().query(GET_ALL_CLUB_IDS, {});
  const clubMap = (allClubs || []).reduce((acc, club) => {
    if (club.cid) acc[club.cid] = club.name;
    if (club._id) acc[club._id] = club.name;
    return acc;
  }, {});

  // Pending transactions: cc/slo see everything pending; a club only sees
  // pending_club requests awaiting its approval on items it owns.
  let rawPendingTransactions = [];
  if (["cc", "slo", "club"].includes(role)) {
    const { data } = await getClient().query(GET_PENDING_TRANSACTIONS, {
      clubid,
    });
    rawPendingTransactions = data?.getPendingTransactions ?? [];
  }

  // All transactions initial fetch
  const { data: allData } = await getClient().query(GET_ALL_TRANSACTIONS, {
    clubid,
    pastTransactionsLimit: 4,
    hideDeleted: true,
  });
  const rawAllTransactions = allData?.getTransactions ?? [];

  const itemMap = await getItemMapFor([
    ...rawPendingTransactions,
    ...rawAllTransactions,
  ]);

  const pendingTransactions = rawPendingTransactions.map((tx) => ({
    ...withItemDetails(tx, itemMap, clubMap),
    clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "SLO",
  }));
  const allTransactions = rawAllTransactions.map((tx) => ({
    ...withItemDetails(tx, itemMap, clubMap),
    clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "SLO",
  }));

  return (
    <Container>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Manage Transactions
        </Typography>

        {["cc", "slo", "club"].includes(role) ? (
          <Button
            component={ButtonLink}
            href="/manage/inventory/transactions/new"
            variant="contained"
            startIcon={<Icon variant="add" />}
          >
            New Transaction
          </Button>
        ) : null}
      </Stack>

      {pendingTransactions.length ? (
        <>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Pending Approvals
          </Typography>
          <TranTable transactions={pendingTransactions} />
          <Divider sx={{ my: 4 }} />
        </>
      ) : null}

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        All Transactions
      </Typography>
      <TranTable
        transactions={allTransactions}
        query={getalltransactionsquery}
        clubid={clubid}
        canViewDeletedTransactions={role === "slo"}
      />
    </Container>
  );
}