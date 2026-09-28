import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_EVENT, GET_UNFINISHED_EVENTS } from "gql/queries/events";
import { GET_FULL_ITEM, GET_FULL_TRANSACTION } from "gql/queries/inventory";

import TransactionForm from "components/inventory/transactions/TranForm";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;
  return {
    title: id ? `Edit Transaction ${id}` : "Edit Transaction",
  };
}

export default async function EditTransactionPage(props) {
  const params = await props.params;
  const { id } = params;

  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  const { data: txData } = await getClient().query(GET_FULL_TRANSACTION, {
    transactionid: id,
  });
  const transaction = txData?.getTransaction ?? null;

  if (!transaction) {
    redirect("/404");
  }

  let item = null;
  if (transaction.itemid) {
    const { data: itemData } = await getClient().query(GET_FULL_ITEM, {
      iid: transaction.itemid,
    });
    item = itemData?.getItem ?? null;
  }

  const role = userMeta?.role;
  const uid = userMeta?.uid;
  const isOwner =
    transaction.user === uid || transaction.clubid === uid;
  const hasPendingClubStage = item?.clubid && item.clubid !== transaction.clubid;
  const state = transaction.status?.state;
  const canEditState =
    state === "incomplete" ||
    (hasPendingClubStage ? state === "pending_club" : state === "pending_slo");

  if (!canEditState || !(isOwner || ["cc", "slo"].includes(role))) {
    redirect("/404");
  }

  const [eventsRes, eventRes] = await Promise.all([
    getClient().query(GET_UNFINISHED_EVENTS, {
      clubid: role === "club" ? uid : null,
      public: false,
      excludeCompleted: true,
    }),
    transaction.eventid
      ? getClient().query(GET_EVENT, { eventid: transaction.eventid })
      : Promise.resolve({ data: null }),
  ]);

  const now = new Date();
  const events = (eventsRes.data?.events ?? []).filter((e) => {
    const end = e.datetimeperiod?.[1] ? new Date(e.datetimeperiod[1]) : null;
    return !end || end >= now;
  });

  // The currently-linked event may no longer be "unfinished" (already
  // ended) — make sure it still shows up as a selectable option.
  const linkedEvent = eventRes.data?.event;
  if (linkedEvent && !events.some((e) => e._id === linkedEvent._id)) {
    events.push(linkedEvent);
  }

  const defaultValues = {
    // The item Select's options are keyed by _id (see TranForm.jsx), so the
    // default value must match that, not the human-readable iid.
    itemid: item?._id ?? transaction.itemid ?? "",
    quantity: transaction.quantity ?? 1,
    startDate: transaction.startDate ?? null,
    endDate: transaction.endDate ?? null,
    useEvent: Boolean(transaction.eventid),
    eventid: transaction.eventid ?? "",
    purpose: transaction.purpose ?? "",
    storageLocation: transaction.storageLocation ?? "",
    remarks: transaction.remarks ?? "",
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        Edit Transaction Request
      </Typography>
      <TransactionForm
        id={transaction.tid}
        action="edit"
        defaultValues={defaultValues}
        items={item ? [item] : []}
        events={events}
        submitLabel="Save Changes"
      />
    </Container>
  );
}
