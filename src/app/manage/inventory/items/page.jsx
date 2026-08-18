

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_ALL_ITEMS } from "gql/queries/inventory";

import Icon from "components/Icon";
import ItemsTable from "components/inventory/items/ItemsTable";
import ButtonLink from "components/Link";

export const metadata = {
  title: "Manage Items",
};

export default async function ManageItems() {
  // fetching user's metadata to determine role and permissions
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const isClubUser = userMeta?.role === "club";
  const clubId = userMeta?.uid;

  // bring all list of inventory items from items subgraph
  const { data: { getItems: allItems = [] } = {} } = await getClient().query(
    GET_ALL_ITEMS,
    {}
  );

  const { data: { allClubs = [] } = {} } = await getClient().query(GET_ALL_CLUB_IDS, {});
  const clubMap = (allClubs || []).reduce((acc, club) => {
    if (club.cid) acc[club.cid] = club.name;
    if (club._id) acc[club._id] = club.name;
    return acc;
  }, {});

  const enrichedItems = allItems.map((item) => ({
    ...item,
    clubName: clubMap[item.clubid] || item.clubName || item.clubid || "—",
  }));

  const possessionItems = isClubUser
    ? enrichedItems.filter((item) => item.clubid === clubId)
    : [];

  const storageItems = isClubUser
    ? enrichedItems.filter((item) => !item.clubid || item.clubid !== clubId)
    : enrichedItems;

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

      {isClubUser && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Items in Possession
          </Typography>
          <ItemsTable items={possessionItems} />
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            mb: 1.5,
          }}
        >
          Items in Storage
        </Typography>
        <ItemsTable items={storageItems} />
      </Box>
    </Container>
  );
}