"use client";

import Chip from "@mui/material/Chip";

const colorMap = {
  incomplete: "default",
  pending: "warning",
  pending_club: "warning",
  pending_slo: "warning",
  approved_slo: "info",
  borrowed: "info",
  completed: "success",
  rejected: "error",
  cancelled: "default",
  deleted: "error",
};

function formatState(state = "unknown") {
  return state
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function TransactionStatus({ status }) {
  const state = status?.state || "unknown";

  return (
    <Chip
      label={formatState(state)}
      color={colorMap[state] || "default"}
      size="small"
      variant="outlined"
    />
  );
}