import { Box } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";

export default function QuickSearchToolbar() {
  return (
    <Box p={1} pb={0}>
      <GridToolbarQuickFilter
        variant="outlined"
        sx={{ width: "100%" }}
        quickFilterParser={(searchInput) =>
          searchInput
            .split(",")
            .map((value) => value.trim())
            .filter((value) => value !== "")
        }
      />
    </Box>
  );
}
