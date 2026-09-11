

import { Box, Button, Card, Container, Grid,Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_ITEMS, GET_ALL_TRANSACTIONS } from "gql/queries/inventory";

import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Inventory",
};

export default async function ManageInventory() {
    const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
        userInput: null,
    });

    const role = userMeta?.role;
    const isClubUser = role === "club";
    const clubFilter = isClubUser ? userMeta?.uid : null;

    // Fetch active clubs for human-readable club names
    const { data: { allClubs = [] } = {} } = await getClient().query(GET_ALL_CLUB_IDS, {});
    const clubMap = (allClubs || []).reduce((acc, club) => {
        if (club.cid) acc[club.cid] = club.name;
        if (club._id) acc[club._id] = club.name;
        return acc;
    }, {});

    // Fetch real items and recent transactions
    const { data: { getItems: displayItems = [] } = {} } = await getClient().query(GET_ALL_ITEMS, {
        clubid: clubFilter,
        limit: 10,
    });

    const { data: { getTransactions: recentTransactions = [] } = {} } = await getClient().query(GET_ALL_TRANSACTIONS, {
        clubid: clubFilter,
        paginationOn: true,
        limit: 10,
        hideDeleted: true,
    });

    const enrichedItems = displayItems.map((item) => ({
        ...item,
        clubName: clubMap[item.clubid] || item.clubName || item.clubid || "—",
    }));

    const enrichedTransactions = recentTransactions.map((tx) => ({
        ...tx,
        clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "—",
    }));

    // Compute basic statistics
    const totalItemsCount = enrichedItems.reduce((acc, item) => acc + (item.totalQty ?? item.total_qty ?? 0), 0);
    const availableItemsCount = enrichedItems.reduce((acc, item) => acc + (item.availableQty ?? item.available_qty ?? 0), 0);
    const borrowedCount = enrichedTransactions.filter(t => t?.status?.state === "borrowed").length;

    const itemsSectionTitle = isClubUser ? "Items in Possession" : "Items in Storage";
    const totalItemsCardTitle = isClubUser ? "Total Items in Possession" : "Total Items in Storage";

    return (
        <Container>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" gutterBottom>
                    Manage Inventory
                </Typography>
                
                {/* Statistics Cards */}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 2, boxShadow: 1 }}>
                            <Typography variant="caption" color="text.secondary">{totalItemsCardTitle}</Typography>
                            <Typography variant="h4" fontWeight={600}>{totalItemsCount}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 2, boxShadow: 1 }}>
                            <Typography variant="caption" color="text.secondary">Available Items</Typography>
                            <Typography variant="h4" fontWeight={600} color="success.main">{availableItemsCount}</Typography>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ p: 2, boxShadow: 1 }}>
                            <Typography variant="caption" color="text.secondary">Active Borrowed Items</Typography>
                            <Typography variant="h4" fontWeight={600} color="warning.main">{borrowedCount}</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "text.secondary",
                            textTransform: "uppercase",
                        }}
                    >
                        Recent Transactions
                    </Typography>
                    <Button
                        component={ButtonLink}
                        href="/manage/inventory/transactions"
                        size="small"
                    >
                        View All Transactions
                    </Button>
                </Stack>
                <TranTable transactions={enrichedTransactions} pageSize={10} hideFooterPagination />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "text.secondary",
                            textTransform: "uppercase",
                        }}
                    >
                        {itemsSectionTitle}
                    </Typography>
                    <Button
                        component={ButtonLink}
                        href="/manage/inventory/items"
                        size="small"
                    >
                        View All Items
                    </Button>
                </Stack>
                <ItemsTable items={enrichedItems} pageSize={10} hideFooterPagination />
            </Box>
        </Container>
    );
}