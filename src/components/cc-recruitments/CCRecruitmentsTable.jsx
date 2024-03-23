"use client";

import { useRouter } from "next/navigation";

import { Typography } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import QuickSearchToolbar from "components/QuickSearchToolbar";

const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 5,
    headerAlign: "center",
    align: "center",
    valueGetter: ({ row }) => ({
      firstName: row.firstName,
      lastName: row.lastName,
    }),
    renderCell: ({ value }) => (
      <Typography variant="body2">
        {value.firstName} {value.lastName}
      </Typography>
    ),
  },
  {
    field: "rollno",
    headerName: "Roll No",
    flex: 3,
  },
  {
    field: "batch",
    headerName: "Batch",
    flex: 3,
  },
  {
    field: "stream",
    headerName: "Stream",
    flex: 3,
  },
];

export default function CCRecruitmentsTable({ data }) {
  const router = useRouter();

  const handleRowClick = (row) => {
    router.push(`/cc-recruitments/all/${row.id}`);
  };

  return (
    <DataGrid
      autoHeight
      rows={data}
      columns={columns}
      getRowId={(row) => row._id}
      pageSize={10}
      disableRowSelectionOnClick
      onRowClick={handleRowClick}
      initialState={{
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
