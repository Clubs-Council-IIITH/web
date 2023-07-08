import { useRouter } from "next/router";

import { Box } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { ISOtoHuman } from "utils/formatTime";
import { stateLabel } from "utils/formatEvent";

import Label from "components/label";
import Iconify from "components/iconify";
import QuickSearchToolbar from "components/QuickSearchToolbar";

const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 5,
  },
  {
    field: "club",
    headerName: "Club",
    flex: 3,
    valueGetter: ({ row }) => row.clubid,
  },
  {
    field: "scheduled",
    headerName: "Scheduled",
    flex: 3,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ISOtoHuman(row.datetimeperiod[0]),
  },
  {
    field: "budget",
    headerName: "Budget",
    flex: 2,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ({ requested: row.budget.length > 0, approved: row.status.budget }),
    renderCell: ({ value }) => (
      <Iconify
        sx={{
          color: !value.requested
            ? "secondary.main"
            : value.approved
            ? "success.main"
            : "error.main",
        }}
        icon={!value.requested ? "mdi:minus" : value.approved ? "mdi:check" : "mdi:close"}
      />
    ),
  },
  {
    field: "venue",
    headerName: "Venue",
    flex: 2,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ({ requested: row.location.length > 0, approved: row.status.room }),
    renderCell: ({ value }) => (
      <Iconify
        sx={{
          color: !value.requested
            ? "secondary.main"
            : value.approved
            ? "success.main"
            : "error.main",
        }}
        icon={!value.requested ? "mdi:minus" : value.approved ? "mdi:check" : "mdi:close"}
      />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 3,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => row.status.state,
    renderCell: ({ value }) => (
      <Label color={stateLabel(value).color}>{stateLabel(value).shortName}</Label>
    ),
  },
];

export function EventsTable({ events, hideClub = false }) {
  const router = useRouter();

  if (!events) return null;
  return (
    <Box width="100%">
      <DataGrid
        rows={events}
        columns={hideClub ? columns.filter((c) => c.field !== "club") : columns}
        getRowId={(r) => r._id}
        onRowClick={(params) => router.push(`/manage/events/${params.row._id}`)}
        initialState={{
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
