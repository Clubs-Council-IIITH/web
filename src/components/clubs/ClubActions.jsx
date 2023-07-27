"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { useState } from "react";

import { Button } from "@mui/material";

import Icon from "components/Icon";
import ConfirmDialog from "components/ConfirmDialog";

import { useToast } from "components/Toast";

export function EditClub({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={Link}
      href={`/manage/clubs/${id}/edit`}
      variant="contained"
      color="warning"
      startIcon={<Icon variant="edit-outline" />}
      sx={sx}
    >
      Edit
    </Button>
  );
}

export function DeleteClub({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const deleteClub = async () => {
    let res = await fetch("/actions/clubs/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Club deleted."],
        severity: "success",
      });
      router.push("/manage/clubs");
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
        title="Are you sure you want to delete this club?"
        description="Deleting the club will mark it as deleted and hidden from the public. This action cannot be undone (for now)."
        onConfirm={deleteClub}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}
