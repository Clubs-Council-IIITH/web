

import { Container, Stack, Typography, Card, Box } from "@mui/material";
import { combineQuery, getClient } from "gql/client";
import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";


export const metadata = {
  title: "Manage Inventory",
};

export default async function ManageInventory() {
    // bring list of inventory items

    // DASHBOARD:
    // - (/inventory) Main inventory page: Two dashboards (for cc/slo all clubs visible, for club only to specific club)
    // - Recent Transactions (top 10-20)
    // - Items in storage (Top 10 arranged based on frequency of transactions) (View all button on top to take to seperate page)
    // - Some statistics like "Number of items borrowed, Number of items in storage"

    // TODO: Replace with real data fetching logic
    const dummyItems = [
        { id: "1", name: "Projector", quantity: 3, status: "available", category: "Electronics", location: "Room 101", lastTransaction: "2026-05-10", owner: "CC", description: "Epson projector" },
        { id: "2", name: "Speaker", quantity: 5, status: "borrowed", category: "Audio", location: "Room 102", lastTransaction: "2026-05-11", owner: "SLC", description: "JBL speaker" },
    ];
    const dummyTransactions = [
        { id: "3", itemName: "Projector", type: "borrow", quantity: 1, date: "2026-05-11", user: "Alice", status: "approved", remarks: "For event" },
        { id: "4", itemName: "Speaker", type: "return", quantity: 2, date: "2026-05-12", user: "Bob", status: "pending", remarks: "Returned late" },
    ];

    return (
        <Container>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h3" gutterBottom>
                    Manage Inventory
                </Typography>
                {/* <Card sx={{ p: 2, mt: 1, width: 'fit-content', boxShadow: 2 }}>
                    <Typography variant="subtitle1">Total: 200</Typography>
                    <Typography variant="subtitle1">Borrowed: 50</Typography>
                </Card> */}
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    Recent Transactions
                </Typography>
                <TranTable transactions={dummyTransactions}/>
            </Box>
            <Box sx={{ mb: 2 }}>
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
                <ItemsTable items={dummyItems}/>
            </Box>
        </Container>
    );
}