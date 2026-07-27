"use client";

import Chip from "@mui/material/Chip";

const colorMap = {
  approved: "success",
  approved_slo: "success",
  pending: "warning",
  pending_slo: "warning",
  borrowed: "info",
  completed: "success",
  rejected: "error",
  incomplete: "default",
  deleted: "error",
  cancelled: "default",
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