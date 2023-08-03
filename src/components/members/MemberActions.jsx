"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@mui/material";

import Icon from "components/Icon";

export function EditMember({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={Link}
      href={`/manage/members/${id}/edit`}
      variant="contained"
      color="warning"
      startIcon={<Icon variant="edit-outline" />}
      sx={sx}
    >
      Edit
    </Button>
  );
}
