

import { Container, Stack, Typography, Card } from "@mui/material";
import { combineQuery, getClient } from "gql/client";
import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";


export const metadata = {
  title: "Manage Transactions",
};

export default async function ManageTransactions() {
    // bring list of inventory items
    const dummyTransactions = [
        { id: "3", itemName: "Projector", type: "borrow", quantity: 1, date: "2026-05-11", user: "Alice", status: "approved", remarks: "For event" },
        { id: "4", itemName: "Speaker", type: "return", quantity: 2, date: "2026-05-12", user: "Bob", status: "pending", remarks: "Returned late" },
    ];

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
            </Stack>
            <div>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    Pending Transactions
                </Typography>
                <TranTable transactions={dummyTransactions} />
            </div>
            <div>
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
            </div>
        </Container>
    );
}