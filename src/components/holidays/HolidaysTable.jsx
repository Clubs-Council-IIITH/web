"use client";

import { useRouter } from "next/navigation";

import { Typography } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { ISOtoHuman } from "utils/formatTime";

import QuickSearchToolbar from "components/QuickSearchToolbar";

export default function EventsTable({ holidays }) {
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 5,
      renderCell: (params) => (
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
          {params.value}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 3,
      valueGetter: (params) => ISOtoHuman(params.row.date, true, false),
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
  ];

  if (!holidays) return null;
  return (
    <DataGrid
      autoHeight
      rows={holidays}
      columns={columns}
      getRowId={(r) => r._id}
      onRowClick={(params) => router.push(`/manage/holidays/${params.row._id}`)}
      disableRowSelectionOnClick
      initialState={{
        sorting: {
          sortModel: [{ field: "date", sort: "asc" }],
        },
        filter: {
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLogicOperator.Or,
          },
        },
        pagination: { paginationModel: { pageSize: 25 } },
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
