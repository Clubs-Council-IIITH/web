"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import { useToast } from "components/Toast";
import Icon from "components/Icon";
import ButtonLink from "components/Link";

import { deleteItemAction } from "actions/inventory/items/delete/server_action";

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

export function DeleteItem({ iid, activeTransactionCount = 0, sx }) {
  const router = useRouter();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const res = await deleteItemAction(iid);
    setLoading(false);
    setDialog(false);
    if (res.ok) {
      triggerToast({ title: "Deleted", messages: ["Item removed."], severity: "success" });
      router.push("/manage/inventory/items");
    } else {
      triggerToast({ ...res.error, severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="delete-forever-outline" />}
        onClick={() => setDialog(true)}
        disabled={loading}
        sx={sx}
      >
        Delete
      </Button>
      <ConfirmDialog
        open={dialog}
        title="Delete this item?"
        description={
          activeTransactionCount > 0
            ? `This item has ${activeTransactionCount} active transaction${activeTransactionCount === 1 ? "" : "s"}, which will also be marked as deleted. This action cannot be undone.`
            : "This action cannot be undone."
        }
        onConfirm={handle}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}

export function NewItem({ sx }) {
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