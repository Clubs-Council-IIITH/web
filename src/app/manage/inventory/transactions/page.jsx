import { Button, Container, Divider, Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import {
  GET_ALL_TRANSACTIONS,
  GET_PENDING_TRANSACTIONS,
} from "gql/queries/inventory";

import Icon from "components/Icon";
import TranTable from "components/inventory/transactions/TranTable";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Transactions",
};

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

  return (data?.getTransactions || []).map((tx) => ({
    ...tx,
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

  // Pending transactions (cc / slo only — query handles auth)
  let pendingTransactions = [];
  if (["cc", "slo"].includes(role)) {
    const { data } = await getClient().query(GET_PENDING_TRANSACTIONS, {
      clubid,
    });
    pendingTransactions = (data?.getPendingTransactions ?? []).map((tx) => ({
      ...tx,
      clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "SLO",
    }));
  }

  // All transactions initial fetch
  const { data: allData } = await getClient().query(GET_ALL_TRANSACTIONS, {
    clubid,
    pastTransactionsLimit: 4,
    hideDeleted: true,
  });
  const allTransactions = (allData?.getTransactions ?? []).map((tx) => ({
    ...tx,
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