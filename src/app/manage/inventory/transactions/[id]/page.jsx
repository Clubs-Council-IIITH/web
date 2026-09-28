import { Box, Divider, Grid, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import {
  GET_ALL_TRANSACTIONS,
  GET_FULL_ITEM,
  GET_FULL_TRANSACTION,
} from "gql/queries/inventory";
import { getFile } from "utils/files";

import ActionPalette from "components/ActionPalette";
import {
  ApproveClubTransaction,
  ApproveSloTransaction,
  CancelTransaction,
  DeleteTransaction,
  EditTransaction,
  MarkBorrowed,
  RejectTransaction,
  ReturnTransaction,
  SubmitTransaction,
} from "components/inventory/transactions/TranActions";
import { TransactionStatus } from "components/inventory/transactions/TranStates";
import TranTable from "components/inventory/transactions/TranTable";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;
  return {
    title: id ? `Transaction ${id}` : "Transaction",
    description: "Transaction details",
  };
}

export default async function ManageTransactionID(props) {
  const params = await props.params;
  const { id } = params;

  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const { data: txData } = await getClient().query(GET_FULL_TRANSACTION, {
    transactionid: id,
  });
  const transaction = txData?.getTransaction ?? null;
  const targetTid = transaction?.tid || transaction?._id || id;

  let item = null;
  if (transaction?.itemid) {
    const { data: itemData } = await getClient().query(GET_FULL_ITEM, {
      iid: transaction.itemid,
    });
    item = itemData?.getItem ?? null;
  }

  // Fetch past related transactions for the same item (last 5)
  let relatedTransactions = [];
  if (transaction?.itemid) {
    const { data: relData } = await getClient().query(GET_ALL_TRANSACTIONS, {
      itemid: transaction.itemid,
      hideDeleted: true,
    });
    relatedTransactions = (relData?.getTransactions ?? []).filter(
      (t) => t.tid !== targetTid && t._id !== id
    );
  }

  const actions = getActions(transaction, userMeta, item?.clubid);

  // Photos are only visible to SLO, the item's owning club, and the
  // requesting (borrowing) club.
  const canViewPhotos =
    userMeta?.role === "slo" ||
    (item?.clubid && userMeta?.uid === item.clubid) ||
    (transaction?.clubid && userMeta?.uid === transaction.clubid);

  const photoBefore = transaction?.photoBefore;
  const photoAfter = transaction?.photoAfter;
  const hasPhotos = canViewPhotos && Boolean(photoBefore || photoAfter);

  return (
    <Box>
      <ActionPalette
        left={[TransactionStatus]}
        leftProps={[{ status: transaction?.status }]}
        right={actions.map((a) => a.component)}
        rightProps={actions.map((a) => ({ tid: targetTid, ...a.props }))}
      />

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {hasPhotos && (
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {photoBefore && (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Before Photo
                </Typography>
                <Box
                  component="img"
                  src={getFile(photoBefore, true)}
                  alt="Before photo"
                  sx={{ width: "100%", borderRadius: 1, mt: 0.5, objectFit: "cover", maxHeight: 220 }}
                />
              </Box>
            )}
            {photoAfter && (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  After Photo
                </Typography>
                <Box
                  component="img"
                  src={getFile(photoAfter, true)}
                  alt="After photo"
                  sx={{ width: "100%", borderRadius: 1, mt: 0.5, objectFit: "cover", maxHeight: 220 }}
                />
              </Box>
            )}
          </Grid>
        )}

        <Grid size={{ xs: 12, md: hasPhotos ? 7 : 12 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h5" fontWeight={600}>
                {item?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item?.iid} · Requested by{" "}
                {transaction?.user || "Unknown"}
              </Typography>
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Club
              </Typography>
              <Typography variant="body1">
                {transaction?.clubName || transaction?.clubid || "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Quantity
              </Typography>
              <Typography variant="body1">
                {transaction?.quantity ?? "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Borrow date
              </Typography>
              <Typography variant="body1">
                {(transaction?.status?.borrowDate)
                  ? new Date(transaction.status.borrowDate).toLocaleDateString()
                  : "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Period
              </Typography>
              <Typography variant="body1">
                {[transaction?.startDate, transaction?.endDate]
                  .filter(Boolean)
                  .join(" → ") || "—"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Storage location
              </Typography>
              <Typography variant="body1">
                {transaction?.storageLocation?.replaceAll("_", " ") || "—"}
              </Typography>
            </Grid>

            {transaction?.eventName && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="overline" color="text.secondary">
                  Event
                </Typography>
                <Typography variant="body1">
                  {transaction.eventName}
                </Typography>
              </Grid>
            )}

            {transaction?.purpose && (
              <Grid size={12}>
                <Typography variant="overline" color="text.secondary">
                  Purpose
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                  {transaction.purpose}
                </Typography>
              </Grid>
            )}

            <Grid size={12}>
              <Typography variant="overline" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                {transaction?.remarks || "No remarks provided."}
              </Typography>
            </Grid>

            {transaction?.status?.sloComment && (
              <Grid size={12}>
                <Typography variant="overline" color="text.secondary">
                  SLO Comment
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {transaction.status.sloComment}
                </Typography>
              </Grid>
            )}

            {transaction?.status?.returnComment && (
              <Grid size={12}>
                <Typography variant="overline" color="text.secondary">
                  Return Comment
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {transaction.status.returnComment}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ textTransform: "uppercase" }}
          >
            Related Transactions (same item)
          </Typography>
          <TranTable transactions={relatedTransactions} item={transaction} />
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Derive the list of action button components based on current state + role.
 * Returns an array of { component, props } objects.
 */
function getActions(transaction, user, itemClubid) {
  const state = transaction?.status?.state;
  const role = user?.role;
  const uid = user?.uid;
  const userClubid = user?.uid;
  const isOwner =
    transaction?.user === uid ||
    (transaction?.clubid && transaction?.clubid === userClubid);

  if (!state || !role) return [];

  const actions = [];

  // Edit: while still incomplete, or awaiting the requesting club's own
  // approval step — pending_club for a cross-club borrow, pending_slo
  // otherwise (no pending_club stage when the club already owns the item
  // or it's SLO-owned).
  // Disabled for the requesting club for now
  const hasPendingClubStage = itemClubid && itemClubid !== transaction?.clubid;
  const canEditState =
    state === "incomplete" ||
    (hasPendingClubStage ? state === "pending_club" : state === "pending_slo");
  if (canEditState && ["cc", "slo"].includes(role)) {
    actions.push({ component: EditTransaction, props: {} });
  }

  // Submit draft
  if (state === "incomplete" && (isOwner || ["cc", "slo"].includes(role))) {
    actions.push({ component: SubmitTransaction, props: {} });
  }

  // Club approves cross-club borrow
  if (
    state === "pending_club" &&
    (itemClubid === userClubid || ["cc", "slo"].includes(role))
  ) {
    actions.push({ component: ApproveClubTransaction, props: {} });
    actions.push({ component: RejectTransaction, props: {} });
  }

  // SLO/CC approves
  if (state === "pending_slo" && ["cc", "slo"].includes(role)) {
    actions.push({ component: ApproveSloTransaction, props: {} });
    actions.push({ component: RejectTransaction, props: {} });
  }

  // Perform borrow: borrowing club (or CC/SLO) uploads photo & status when approved_slo
  if (state === "approved_slo" && (isOwner || ["cc", "slo"].includes(role))) {
    actions.push({ component: MarkBorrowed, props: {} });
  }

  // Club cancels after SLO approval
  if (state === "approved_slo" && (isOwner || ["cc", "slo"].includes(role))) {
    actions.push({ component: CancelTransaction, props: {} });
  }

  // Perform return: borrowing club (or CC/SLO) uploads return details when borrowed
  if (state === "borrowed" && (isOwner || ["cc", "slo"].includes(role))) {
    actions.push({ component: ReturnTransaction, props: {} });
  }

  // CC / SLO can always soft-delete
  if (["cc", "slo"].includes(role) && state !== "deleted") {
    actions.push({ component: DeleteTransaction, props: {} });
  }

  return actions;
}