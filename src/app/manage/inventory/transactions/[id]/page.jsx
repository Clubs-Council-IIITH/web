import { Box, Divider, Grid, Typography } from "@mui/material";

import ActionPalette from "components/ActionPalette";
import { ApproveSloTransaction } from "components/inventory/transactions/TranActions";
import TranTable from "components/inventory/transactions/TranTable";
import { TransactionStatus } from "components/inventory/transactions/TranStates";

const dummyTransaction = {
  _id: "t-101",
  itemid: "1",
  itemName: "Projector",
  itemCode: "INV-001",
  brand: "Epson",
  clubid: "studlife.office",
  clubName: "Student Life Office",
  quantity: 1,
  borrow_date: "2026-07-01",
  startDate: "2026-07-01",
  endDate: "2026-07-03",
  purpose: "Annual meetup",
  pickupLocation: "Store Room A",
  storageLocation: "Main Hall Storage",
  eventid: "e-11",
  eventName: "Annual Day",
  user: "Alice",
  remarks: "Handle with care",
  approver: "slo-1",
  status: { state: "pending_slo" },
};

const dummyRelatedTransactions = [
  {
    _id: "t-099",
    itemName: "Projector",
    brand: "Epson",
    quantity: 1,
    borrow_date: "2026-06-15",
    period: "2026-06-15 - 2026-06-16",
    user: "Charlie",
    status: { state: "completed" },
  },
  {
    _id: "t-100",
    itemName: "Projector",
    brand: "Epson",
    quantity: 1,
    borrow_date: "2026-06-24",
    period: "2026-06-24 - 2026-06-25",
    user: "Dana",
    status: { state: "borrowed" },
  },
];

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  return {
    title: id ? `Transaction ${id}` : "Transaction",
    description: "Transaction details",
  };
}

export default async function ManageTransactionID(props) {
  const params = await props.params;
  const { id } = params;

  const transaction = dummyTransaction;
  const user = { role: "slo" };

  return (
    <Box>
      <ActionPalette
        left={[TransactionStatus]}
        leftProps={[{ status: transaction?.status }]}
        right={getActions(transaction, user)}
        rightProps={[{}]}
      />

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h5" fontWeight={600}>
                {transaction?.itemName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Requested by {transaction?.user || "Unknown"}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Club
              </Typography>
              <Typography variant="body1">{transaction?.clubName || transaction?.clubid || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Quantity
              </Typography>
              <Typography variant="body1">{transaction?.quantity ?? "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Borrow date
              </Typography>
              <Typography variant="body1">{transaction?.borrow_date || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Period
              </Typography>
              <Typography variant="body1">
                {[transaction?.startDate, transaction?.endDate].filter(Boolean).join(" - ") || "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Pickup location
              </Typography>
              <Typography variant="body1">{transaction?.pickupLocation || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Storage location
              </Typography>
              <Typography variant="body1">{transaction?.storageLocation || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Event
              </Typography>
              <Typography variant="body1">{transaction?.eventName || "—"}</Typography>
            </Grid>

            <Grid size={12}>
              <Typography variant="overline" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                {transaction?.remarks || "No remarks provided."}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom sx={{ textTransform: "uppercase" }}>
            Related Transactions
          </Typography>
          <TranTable transactions={dummyRelatedTransactions} item={transaction} />
        </Grid>
      </Grid>
    </Box>
  );
}

function getActions(transaction, user) {
  if (user?.role === "slo" && transaction?.status?.state === "pending_slo") {
    return [ApproveSloTransaction];
  }

  if (user?.role === "cc" && transaction?.status?.state === "pending_slo") {
    return [ApproveSloTransaction];
  }

  return [];
}