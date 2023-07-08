import { useRouter } from "next/router";

import { Box, Avatar } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Label from "components/label";
import QuickSearchToolbar from "components/QuickSearchToolbar";

import { downloadFile } from "utils/files";

const columns = [
  {
    field: "img",
    headerName: "",
    flex: 1,
    valueGetter: ({ row }) => ({ name: row.name, logo: row.logo }),
    renderCell: ({ value }) => (
      <Avatar src={downloadFile(value.logo)} alt={value.name} sx={{ height: 32, width: 32 }} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    flex: 6,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 6,
    renderCell: ({ value }) => (
      <Box textTransform="lowercase" fontSize="0.9em" fontFamily="monospace">
        {value}
      </Box>
    ),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 2,
    renderCell: ({ value }) => <Box textTransform="capitalize">{value}</Box>,
  },
  {
    field: "state",
    headerName: "State",
    align: "center",
    headerAlign: "center",
    flex: 2,
    renderCell: ({ value }) => (
      <Label color={value === "active" ? "success" : "error"}>{value}</Label>
    ),
  },
];

export function ClubsTable({ clubs }) {
  const router = useRouter();

  if (!clubs) return null;
  return (
    <Box width="100%">
      <DataGrid
        rows={clubs}
        columns={columns}
        getRowId={(r) => r.cid}
        onRowClick={(params) => router.push(`/manage/clubs/${params.row.cid}`)}
        initialState={{
          sorting: {
            sortModel: [{ field: "name", sort: "asc" }],
          },
          filter: {
            filterModel: {
              items: [],
              quickFilterLogicOperator: GridLogicOperator.Or,
            },
          },
        }}
        slots={{ toolbar: QuickSearchToolbar }}
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
          // pointer cursor on ALL rows
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}
