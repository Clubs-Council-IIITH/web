

import { Button, Container, Stack, Typography, Card } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
// import { GET_ALL_ITEMS, GET_PENDING_ITEMS } from "gql/queries/inventory";

import ItemsTable from "components/inventory/items/ItemsTable";
import TranTable from "components/inventory/transactions/TranTable";
import ButtonLink from "components/Link";
import Icon from "components/Icon";


export const metadata = {
  title: "Manage Items",
};

export default async function ManageItems() {
    // fetching user's metadata to determine role and permissions
    const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
        userInput: null,
      });

    // bring list of inventory items
    // const { data: { allItems } = {} } = await getClient().query(GET_ALL_ITEMS);
    // const { data: { pendingItems } = {} } = await getClient().query(
    // GET_PENDING_ITEMS
    // );
    
    const dummyItems = [
        { id: "1", name: "Projector", quantity: 3, status: "available", category: "Electronics", location: "Room 101", lastTransaction: "2026-05-10", owner: "CC", description: "Epson projector" },
        { id: "2", name: "Speaker", quantity: 5, status: "borrowed", category: "Audio", location: "Room 102", lastTransaction: "2026-05-11", owner: "SLC", description: "JBL speaker" },
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

                {["cc", "slo"].includes(userMeta?.role) ? (
                          <Button
                            component={ButtonLink}
                            href="/manage/inventory/items/new"
                            variant="contained"
                            startIcon={<Icon variant="add" />}
                          >
                            New Item
                          </Button>
                        ) : null}
            </Stack>
            {dummyItems.length ? <div>
                <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                        color: "text.secondary",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    Items for Approval
                </Typography>
                <ItemsTable 
                    items={dummyItems}
                    isPending={true}
                />
            </div> : null}
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
                <ItemsTable 
                    items={dummyItems}
                    isPending={false}
                />
            </div>
        </Container>
    );
}