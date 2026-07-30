"use client";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";

export default  
function UserAchievements({ rows = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "name",
      headerName: "Achievement",
      flex: isMobile ? null : 7,
      renderCell: (p) => {
        return (
          <Typography
            variant="body2"
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              msWordBreak: "break-all",
              wordBreak: "break-all",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
            }}
          >
            {p.value}
          </Typography>
        );
      },
    display: "flex",
    },
    {
      field: "achievementType",
      headerName: "Type",
      flex: isMobile ? null : 5,
      renderCell: (p) => {

        return (
          <Typography
            variant="body2"
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              msWordBreak: "break-all",
              wordBreak: "break-all",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
              padding: "4px 8px",
              borderRadius: "4px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {p.value.charAt(0).toUpperCase() + p.value.slice(1)}
          </Typography>
        );
      },
    display: "flex",
    },
  ];

  return (
    <>
    {rows?.length ? (
      <>
        <DataGrid
          autoHeight
          getRowHeight={() => (isMobile ? "auto" : null)}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
          initialState={{
            sorting: {
              sortModel: [{ field: "end", sort: "desc" }],
            },
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            // disable cell selection style
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </>
    ) : (
      "No Achievements Found!"
      )}
    </>
  );
}