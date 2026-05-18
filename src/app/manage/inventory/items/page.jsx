

import { Container, Stack, Typography, Card } from "@mui/material";
import { combineQuery, getClient } from "gql/client";
import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";


export const metadata = {
  title: "Manage Items",
};

export default async function ManageItems() {
    // bring list of inventory items

    // DASHBOARD:
    // - (/inventory) Main inventory page: Two dashboards (for cc/slo all clubs visible, for club only to specific club)
    // - Recent Transactions (top 10-20)
    // - Items in storage (Top 10 arranged based on frequency of transactions) (View all button on top to take to seperate page)
    // - Some statistics like "Number of items borrowed, Number of items in storage"
    // Dummy data for demonstration
    const dummyItems = [
        { _id: "1", name: "Projector", quantity: 3, status: "available", category: "Electronics", location: "Room 101", lastTransaction: "2026-05-10", owner: "CC", description: "Epson projector" },
        { _id: "2", name: "Speaker", quantity: 5, status: "borrowed", category: "Audio", location: "Room 102", lastTransaction: "2026-05-11", owner: "SLC", description: "JBL speaker" },
    ];
    const dummyTransactions = [
        { _id: "3", itemName: "Projector", type: "borrow", quantity: 1, date: "2026-05-11", user: "Alice", status: "approved", remarks: "For event" },
        { _id: "4", itemName: "Speaker", type: "return", quantity: 2, date: "2026-05-12", user: "Bob", status: "pending", remarks: "Returned late" },
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
                    Manage Items
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
                    Pending Items Additions
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
                    Items in Storage
                </Typography>
                <ItemsTable items={dummyItems} />
            </div>
        </Container>
    );
}