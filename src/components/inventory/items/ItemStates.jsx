"use client";

import Chip from "@mui/material/Chip";

const colorMap = {
  approved: "success",
  pending: "warning",
  pending_cc: "warning",
  pending_slo: "warning",
  incomplete: "default",
  deleted: "error",
  rejected: "error",
};

function formatLabel(state = "unknown") {
  return state
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "cc" || lower === "slo" || lower === "slc") {
        return lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function ItemStatus({ status }) {
  const state = typeof status === "string" ? status : status?.state || "unknown";

  return (
    <Chip
      label={formatLabel(state)}
      color={colorMap[state] || "default"}
      size="small"
      variant="outlined"
    />
  );
}