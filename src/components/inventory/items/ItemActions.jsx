"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button, Tooltip } from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import Icon from "components/Icon";
import ButtonLink from "components/Link";
import { useToast } from "components/Toast";

// import { deleteItemAction } from "actions/events/delete/server_action";

export function EditItem({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={ButtonLink}
      href={`/manage/inventory/items/${id}/edit`}
      variant="contained"
      color="warning"
      startIcon={<Icon variant="edit-outline" />}
      sx={sx}
    >
      Edit
    </Button>
  );
}

export function NewItem({ sx }) {
  const { id } = useParams();

  return (
    <Button
        component={ButtonLink}
        href="/manage/inventory/items/new"
        variant="contained"
        startIcon={<Icon variant="add" />}
    >
        New Item
    </Button>
  );
}

export function DeleteItem({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const deleteItem = async () => {
    let res = await deleteItemAction(id);

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Item deleted."],
        severity: "success",
      });
      router.push("/manage/transactions/items");
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="delete-forever-outline" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Delete
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Are you sure you want to delete this item?"
        description="This action cannot be undone."
        onConfirm={deleteItem}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}

export function ApproveItem({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const approveItem = async () => {
    let res = await itemApprove({
     itemid: id,
    });
    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Item approved."],
        severity: "success",
      });
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<Icon variant="done" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Approve
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Are you sure you want to approve this item?"
        description="It will be added to the inventory storage."
        onConfirm={approveItem}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "success" }}
        confirmText="Yes, approve it"
      />
    </>
  );
}

export function RejectItem({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const rejectItem = async () => {
    let res = await itemReject({
     itemid: id,
    });
    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Item rejected."],
        severity: "success",
      });
      router.push('/manage/transactions/items');
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="close" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Reject
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Are you sure you want to reject this item?"
        description="It will not be added to the inventory storage."
        onConfirm={rejectItem}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, reject it"
      />
    </>
  );
}

export function SubmitItem({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();

  const submitItem = async () => {
    let res = await itemProgress({
      itemid: id,
    });

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Item submitted."],
        severity: "success",
      });
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
      <Tooltip>
        <span>
          <Button
            variant="contained"
            color="info"
            startIcon={<Icon variant="thumb-up-outline-rounded" />}
            onClick={submitItem}
            sx={sx}
          >
            Submit
          </Button>
        </span>
      </Tooltip>
    );
}