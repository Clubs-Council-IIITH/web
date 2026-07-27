import { Button, Container, Divider, Stack, Typography } from "@mui/material";

import ButtonLink from "components/Link";
import Icon from "components/Icon";
import TranTable from "components/inventory/transactions/TranTable";

export const metadata = {
  title: "Manage Transactions",
};

const dummyUser = { role: "slo" };

const dummyPendingTransactions = [
  {
    _id: "1",
    itemName: "Projector",
    brand: "Epson",
    quantity: 1,
    borrow_date: "2026-07-01",
    period: "2026-07-01 - 2026-07-03",
    user: "Alice",
    status: { state: "pending_slo" },
  },
  {
    _id: "t-102",
    itemName: "Speaker",
    brand: "JBL",
    quantity: 2,
    borrow_date: "2026-07-04",
    period: "2026-07-04 - 2026-07-06",
    user: "Bob",
    status: { state: "pending_slo" },
  },
];

const dummyTransactions = [
  ...dummyPendingTransactions,
  {
    _id: "t-103",
    itemName: "Mic Kit",
    brand: "Shure",
    quantity: 1,
    borrow_date: "2026-06-27",
    period: "2026-06-27 - 2026-06-28",
    user: "Charlie",
    status: { state: "borrowed" },
  },
  {
    _id: "t-104",
    itemName: "Projector",
    brand: "Epson",
    quantity: 1,
    borrow_date: "2026-06-15",
    period: "2026-06-15 - 2026-06-16",
    user: "Dana",
    status: { state: "completed" },
  },
];

export default async function ManageTransactions() {
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

        {["cc", "slo", "club"].includes(dummyUser.role) ? (
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

      {dummyPendingTransactions.length ? (
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
            Pending SLO Approvals
          </Typography>
          <TranTable transactions={dummyPendingTransactions} />
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
      <TranTable transactions={dummyTransactions} />
    </Container>
  );
}