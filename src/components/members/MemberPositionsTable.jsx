"use client";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import Tag from "components/Tag";

const columns = [
  {
    field: "name",
    headerName: "Role",
    flex: 5,
  },
  {
    field: "startYear",
    headerName: "Start Year",
    flex: 2,
  },
  {
    field: "endYear",
    headerName: "End Year",
    valueGetter: ({ row }) => row.endYear || "-",
    flex: 2,
  },
  {
    field: "approved",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    flex: 2,
    renderCell: ({ value }) => (
      <Tag
        label={value ? "Approved" : "Pending"}
        color={value ? "success" : "warning"}
      />
    ),
  },
];

export default function MemberPositionsTable({ roles }) {
  return (
    <Box width="100%">
      <DataGrid
        rows={roles}
        columns={columns}
        getRowId={(r) => r.rid}
        disableRowSelectionOnClick
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />
    </Box>
  );
}
