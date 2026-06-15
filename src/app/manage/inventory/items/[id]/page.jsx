import { redirect } from "next/navigation";

import {
  Box,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_ACTIVE_CLUBS } from "gql/queries/clubs";
// import { GET_FULL_ITEM } from "gql/queries/inventory";

import ActionPalette from "components/ActionPalette";
import {
  ApproveItem,
  DeleteItem,
  EditItem,
  RejectItem,
  SubmitItem,
} from "components/inventory/items/ItemActions";
import TranTable from "components/inventory/transactions/TranTable";

// replace with <ItemStatus> once written
function ItemStatus({ status }) {
  const state = status?.state || "unknown";
  const colorMap = {
    approved: "success",
    pending: "warning",
    incomplete: "default",
    deleted: "error",
  };
  return (
    <Chip
      label={state.charAt(0).toUpperCase() + state.slice(1)}
      color={colorMap[state] || "default"}
      size="small"
      variant="outlined"
    />
  );
}

// dummy data: remove once GET_FULL_ITEM is wired
const dummyItem = {
  _id: "1",
  name: "Projector",
  quantity: 3,
  instock: 3,
  status: { state: "approved" },
  brand: "Epson",
  clubid: "studlife.office",
  description: "Used for club presentations and screenings.",
  warrantyDetails: "2-year manufacturer warranty",
  photo: "http://localhost/_next/image?url=http%3A%2F%2Ffiles%2Ffiles%2Fstatic%3Ffilename%3D1.jpg%26filetype%3Dgallery&w=3840&q=75",
  billOfPurchase: "https://docs.google.com/document/d/1hWIPaX7OJTW6FAAuFySfTHjAAMHUczPgLzcysaGjULs/edit?tab=t.0",
  itemCode: null,
};

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  // const { data: { inventoryItem: item } = {} } = await getClient().query(
  //   GET_FULL_ITEM,
  //   { id },
  // );
  const item = dummyItem;

  return {
    title: item?.name ?? "Inventory Item",
    description: item?.description || "No description provided.",
  };
}

export default async function ManageInventoryItemID(props) {
  const params = await props.params;
  const { id } = params;

  // const { data: { inventoryItem: item } = {}, error } = await getClient().query(
  //   GET_FULL_ITEM,
  //   { id },
  // );
  const item = dummyItem;
  const error = null;

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
    user?.uid !== item?.clubid
  ) {
    redirect("/404");
  }

  const ownerClub = allClubs?.find((c) => c.cid === item?.clubid);

  return (
    <Box>
      <ActionPalette
        left={[ItemStatus]}
        leftProps={[{ status: item?.status }]}
        right={getActions(item, user)}
        rightProps={[{}]}
      />

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* photo + bill */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* photo */}
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

          {/* bill of purchase */}
          {item?.billOfPurchase ? (
            <Box
              component="a"
              href={item.billOfPurchase}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                textDecoration: "none",
                color: "text.primary",
                "&:hover": { backgroundColor: "action.hover" },
                cursor: "pointer",
              }}
            >
              <PictureAsPdfIcon color="error" />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Bill of Purchase
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to download
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <PictureAsPdfIcon color="disabled" />
              <Typography variant="body2" color="text.secondary">
                No bill uploaded
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
              {item?.status?.state === "approved" && item?.itemCode ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "monospace", letterSpacing: 1 }}
                >
                  {item.itemCode}
                </Typography>
              ) : null}
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            {/* metadata */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Owner Club
              </Typography>
              <Typography variant="body1">
                {ownerClub?.name ?? item?.clubid ?? "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Total Quantity
              </Typography>
              <Typography variant="body1">{item?.quantity ?? "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Quantity in store
              </Typography>
              <Typography variant="body1">{item?.instock ?? "—"}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Brand
              </Typography>
              <Typography variant="body1">{item?.brand || "—"}</Typography>
            </Grid>

            {item?.warrantyDetails ? (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="overline" color="text.secondary">
                  Warranty
                </Typography>
                <Typography variant="body1">{item.warrantyDetails}</Typography>
              </Grid>
            ) : null}

            {item?.description ? (
              <Grid size={12}>
                <Typography variant="overline" color="text.secondary">
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
                >
                  {item.description}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <TranTable item={item} />
      </Grid>
    </Box>
  );
}


function getActions(item, user) {
  const state = item?.status?.state;

  if (user?.role === "club") {
    if (state === "incomplete") return [SubmitItem];
    return [];
  }

  if (["cc", "slo"].includes(user?.role)) {
    if (state === "pending") return [ApproveItem, RejectItem, EditItem];
    if (state === "deleted") return [];
    return [EditItem, DeleteItem];
  }

  return [];
}