import { redirect } from "next/navigation";

import {
  Box,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";
import { GET_ALL_TRANSACTIONS, GET_FULL_ITEM } from "gql/queries/inventory";

import ActionPalette from "components/ActionPalette";
import { EditItem } from "components/inventory/items/ItemActions";
import { ItemStatus } from "components/inventory/items/ItemStates";
import TranTable from "components/inventory/transactions/TranTable";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const { data: { getItem: item } = {} } = await getClient().query(
    GET_FULL_ITEM,
    { iid: id },
  );

  return {
    title: item?.name ?? "Inventory Item",
    description: item?.otherDetails || item?.other_details || "No description provided.",
  };
}

export default async function ManageInventoryItemID(props) {
  const params = await props.params;
  const { id } = params;

  const { data: { getItem: item } = {}, error } = await getClient().query(
    GET_FULL_ITEM,
    { iid: id },
  );

  if (error?.message?.includes("Item not found") || !item) {
    return redirect("/404");
  }

  const { document, variables } = combineQuery("CombinedInventoryItemQuery")
    .add(GET_ACTIVE_CLUBS)
    .add(GET_USER, { userInput: null });

  const { data: combinedData = {} } = await getClient().query(
    document,
    variables,
  );

  const { allClubs, userMeta, userProfile } = combinedData;
  const user = { ...userMeta, ...userProfile };

  // clubs can only see their own items
  if (
    user?.role === "club" &&
    item?.clubid &&
    user?.uid !== item?.clubid
  ) {
    redirect("/404");
  }

  const ownerClub = allClubs?.find((c) => c.cid === item?.clubid);
  const { data: transactionData } = await getClient().query(
    GET_ALL_TRANSACTIONS,
    { itemid: item.iid, hideDeleted: true, paginationOn: true, limit: 25 },
  );
  const relatedTransactions = transactionData?.getTransactions ?? [];

  return (
    <Box>
      <ActionPalette
        left={[ItemStatus]}
        leftProps={[{ status: item?.status || { state: "approved" } }]}
        right={getActions(item, user)}
        rightProps={[{}]}
      />

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* photo */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {item?.photo ? (
            <Box
              component="img"
              src={item.photo}
              alt={item.name}
              sx={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No photo
              </Typography>
            </Box>
          )}
        </Grid>

        {/* item details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            {/* name + item code */}
            <Grid size={12}>
              <Typography variant="h5" fontWeight={600}>
                {item?.name}
              </Typography>
              {item?.iid ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "monospace", letterSpacing: 1 }}
                >
                  Asset Code: {item.iid}
                </Typography>
              ) : null}
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            {/* metadata */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Owner / Club
              </Typography>
              <Typography variant="body1">
                {ownerClub?.name ?? item?.clubid ?? "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Brand
              </Typography>
              <Typography variant="body1">{item?.brand || "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Net Quantity
              </Typography>
              <Typography variant="body1">{item?.netQty ?? item?.net_qty ?? 0}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Available Quantity
              </Typography>
              <Typography variant="body1">{item?.availableQty ?? item?.available_qty ?? 0}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Total Quantity
              </Typography>
              <Typography variant="body1">{item?.totalQty ?? item?.total_qty ?? 0}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Current Location
              </Typography>
              <Typography variant="body1">
                {Array.isArray(item?.currentLocation || item?.current_location)
                  ? (item.currentLocation || item.current_location).join(", ")
                  : (item?.currentLocation || item?.current_location) || "—"}
              </Typography>
            </Grid>

            {(item?.warrantyDetails || item?.warranty_details) ? (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="overline" color="text.secondary">
                  Warranty Details
                </Typography>
                <Typography variant="body1">{item.warrantyDetails || item.warranty_details}</Typography>
              </Grid>
            ) : null}

            {(item?.otherDetails || item?.other_details) ? (
              <Grid size={12}>
                <Typography variant="overline" color="text.secondary">
                  Other Details
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                >
                  {item.otherDetails || item.other_details}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid size={12}>
          <TranTable item={item} transactions={relatedTransactions} />
        </Grid>
      </Grid>
    </Box>
  );
}

function getActions(item, user) {
  return ["cc", "slo", "club"].includes(user?.role) ? [EditItem] : [];
}