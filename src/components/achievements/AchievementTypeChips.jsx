"use client";

import { Chip, Grid } from "@mui/material";

import { useMode } from "contexts/ModeContext";

export const typeColorMap = {
  project: "error",
  competition: "info",
  other: "secondary",
};

export default function AchievementTypeChips({ achievementType }) {
  const { isDark } = useMode();
  const color = typeColorMap[achievementType];
  if (!color) return null;
  return (
    <>
      <Grid>
        <Chip
          label={
            achievementType.charAt(0).toUpperCase() + achievementType.slice(1)
          }
          sx={{
            color: isDark ? `${color}.lighter` : `${color}.dark`,
            backgroundColor: isDark ? `${color}.dark` : `${color}.lighter`,
            fontWeight: "bold",
          }}
        />
      </Grid>
    </>
  );
}
