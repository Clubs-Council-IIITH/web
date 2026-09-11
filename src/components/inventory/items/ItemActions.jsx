"use client";

import { useParams } from "next/navigation";
import { Button } from "@mui/material";
import Icon from "components/Icon";
import ButtonLink from "components/Link";

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