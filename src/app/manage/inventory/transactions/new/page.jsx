import { Container, Typography } from "@mui/material";

import TransactionForm from "components/inventory/transactions/TranForm";

export const metadata = {
  title: "New Transaction",
};

const dummyItems = [
  { _id: "1", name: "Projector" },
  { _id: "2", name: "Speaker" },
  { _id: "3", name: "Mic Kit" },
];

const dummyEvents = [
  { _id: "e1", name: "Annual Day" },
  { _id: "e2", name: "Orientation" },
];

const dummyPocs = [
  { uid: "u1", name: "Alice Johnson" },
  { uid: "u2", name: "Bob Smith" },
];

export default function NewTransactionPage() {
  return (
    <Container>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          mb: 3,
        }}
      >
        Request Inventory Items
      </Typography>
      <TransactionForm
        items={dummyItems}
        events={dummyEvents}
        pocs={dummyPocs}
        submitLabel="Create Request"
      />
    </Container>
  );
}