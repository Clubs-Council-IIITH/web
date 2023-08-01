"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { Box, Avatar } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Tag from "components/Tag";
import QuickSearchToolbar from "components/QuickSearchToolbar";

import { getFile } from "utils/files";

const columns = [
  {
    field: "img",
    headerName: "",
    flex: 1,
    valueGetter: ({ row }) => ({ name: row.name, logo: row.logo }),
    renderCell: ({ value }) => (
      <Avatar sx={{ height: 32, width: 32 }}>
        <Image alt={value.name} src={getFile(value.logo)} fill={true} />
      </Avatar>
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
      <Tag label={value} color={value === "active" ? "success" : "error"} />
    ),
  },
];

export default function ClubsTable({ clubs }) {
  const router = useRouter();

  if (!clubs) return null;
  return (
    <DataGrid
      autoHeight
      rows={clubs}
      columns={columns}
      getRowId={(r) => r.cid}
      onRowClick={(params) => router.push(`/manage/clubs/${params.row.cid}`)}
      disableRowSelectionOnClick
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
  );
}
