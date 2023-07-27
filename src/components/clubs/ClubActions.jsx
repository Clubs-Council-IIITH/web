"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { useState } from "react";

import { useMutation } from "@apollo/client";
import { DELETE_CLUB } from "gql/mutations/clubs";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

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

  const [deleteClub] = useMutation(DELETE_CLUB, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_ALL_CLUBS }],
    variables: {
      clubInput: {
        cid: id,
      },
    },
    onCompleted: () => {
      // show success toast
      triggerToast({
        title: "Success!",
        messages: ["Club deleted."],
        severity: "success",
      });

      // redirect to manage page
      router.push("/manage/clubs");
    },
    onError: (error) => {
      // show error toast
      triggerToast({
        title: error.name,
        messages: error?.graphQLErrors?.map((g) => g?.message),
        severity: "error",
      });
    },
  });

  return (
    <>
      <Button
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
