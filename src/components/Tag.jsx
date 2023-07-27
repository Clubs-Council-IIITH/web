"use client";

import { Chip } from "@mui/material";

export default function Tag({ label, color, icon, sx = {} }) {
  return (
    <Chip
      variant="outlined"
      icon={icon}
      label={label}
      color={color}
      sx={{
        textTransform: "capitalize",
        borderRadius: 1,
        color: `${color}.dark`,
        fontWeight: "bold",
        backgroundColor: `${color}.lighter`,
        ...sx,
      }}
    />
  );
}
