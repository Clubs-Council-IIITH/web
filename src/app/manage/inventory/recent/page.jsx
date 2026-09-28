

import { Box, Button, Card, Container, Grid,Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_ITEMS, GET_ALL_TRANSACTIONS, GET_FULL_ITEM } from "gql/queries/inventory";

import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Inventory",
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

    // Fetch all items (for accurate stats) and recent transactions
    const { data: { getItems: allItems = [] } = {} } = await getClient().query(GET_ALL_ITEMS, {
        clubid: clubFilter,
    });
    const displayItems = allItems.slice(0, 10);

    // Fetch all matching transactions (for accurate stats); the backend
    // returns everything when paginationOn isn't set.
    const { data: { getTransactions: allTransactions = [] } = {} } = await getClient().query(GET_ALL_TRANSACTIONS, {
        clubid: clubFilter,
        hideDeleted: true,
    });
    const recentTransactions = allTransactions.slice(0, 10);

    const enrichedItems = displayItems.map((item) => ({
        ...item,
        clubName: clubMap[item.clubid] || item.clubName || item.clubid || "—",
    }));

    const itemMap = await getItemMapFor(recentTransactions);
    const enrichedTransactions = recentTransactions.map((tx) => {
        const item = itemMap[tx.itemid];
        return {
            ...tx,
            itemName: item?.name,
            itemCode: item?.iid,
            itemClubName: item?.clubid ? clubMap[item.clubid] || item.clubid : null,
            clubName: clubMap[tx.clubid] || tx.clubName || tx.clubid || "—",
        };
    });

    // Compute basic statistics across the full item/transaction sets, not
    // just the 10-row previews shown in the tables below.
    const totalItemsCount = allItems.length;
    const availableItemsCount = allItems.reduce((acc, item) => acc + (item.availableQty ?? 0), 0);
    const borrowedQuantity = allTransactions
        .filter((t) => t?.status?.state === "borrowed")
        .reduce((acc, t) => acc + (t.quantity ?? 0), 0);

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
                            <Typography variant="h4" fontWeight={600} color="warning.main">{borrowedQuantity}</Typography>
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