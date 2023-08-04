"use client";

import { useRouter } from "next/navigation";

import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { ISOtoHuman } from "utils/formatTime";
import { stateLabel } from "utils/formatEvent";

import Tag from "components/Tag";
import Icon from "components/Icon";
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
    valueGetter: ({ row }) => row.datetimeperiod[0],
    valueFormatter: ({ value }) => ISOtoHuman(value),
  },
  {
    field: "budget",
    headerName: "Budget",
    flex: 2,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ({
      requested: row.budget.length > 0,
      approved: row.status.budget,
    }),
    renderCell: ({ value }) => (
      <Icon
        sx={{
          color: !value.requested
            ? "secondary.main"
            : value.approved
            ? "success.main"
            : "error.main",
        }}
        variant={
          !value.requested
            ? "remove-rounded"
            : value.approved
            ? "check"
            : "close-rounded"
        }
      />
    ),
  },
  {
    field: "venue",
    headerName: "Venue",
    flex: 2,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ({
      requested: row.location.length > 0,
      approved: row.status.room,
    }),
    renderCell: ({ value }) => (
      <Icon
        sx={{
          color: !value.requested
            ? "secondary.main"
            : value.approved
            ? "success.main"
            : "error.main",
        }}
        variant={
          !value.requested
            ? "remove-rounded"
            : value.approved
            ? "check"
            : "close-rounded"
        }
      />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 3,
    align: "center",
    headerAlign: "center",
    valueGetter: ({ row }) => ({
      state: row.status.state,
      start: row.datetimeperiod[0],
    }),
    renderCell: ({ value }) => {
      // change state to 'completed' if it has been approved and is in the past
      if (value.state === "approved" && new Date(value.start) < new Date())
        value.state = "completed";

      return (
        <Tag
          label={stateLabel(value.state).shortName}
          color={stateLabel(value.state).color}
        />
      );
    },
  },
];

export default function EventsTable({
  events,
  scheduleSort = "asc",
  hideClub = false,
}) {
  const router = useRouter();

  if (!events) return null;
  return (
    <DataGrid
      autoHeight
      rows={events}
      columns={hideClub ? columns.filter((c) => c.field !== "club") : columns}
      getRowId={(r) => r._id}
      onRowClick={(params) => router.push(`/manage/events/${params.row._id}`)}
      disableRowSelectionOnClick
      initialState={{
        sorting: {
          sortModel: [{ field: "scheduled", sort: scheduleSort }],
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
