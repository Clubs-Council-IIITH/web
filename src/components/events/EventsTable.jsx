"use client";

import { useRouter } from "next/navigation";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { ISOtoHuman } from "utils/formatTime";
import { stateLabel } from "utils/formatEvent";

import Tag from "components/Tag";
import Icon from "components/Icon";
import QuickSearchToolbar from "components/QuickSearchToolbar";

export default function EventsTable({
  events,
  scheduleSort = "asc",
  hideClub = false,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    ...(isMobile
      ? []
      : [
          {
            field: "code",
            headerName: "",
            flex: 3,
            renderCell: ({ value }) => (
              <Typography variant="body2" color="text.disabled">
                {value}
              </Typography>
            ),
            display: "flex",
          },
        ]),
    {
      field: "name",
      headerName: "Name",
      flex: isMobile ? null : 5,
      renderCell: (p) =>
        p.value ? (
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
        ) : (
          p.value
        ),
      display: "flex",
    },
    ...(isMobile
      ? []
      : [
          {
            field: "club",
            headerName: "Club ID",
            flex: 3,
            valueGetter: (value, row, column, apiRef) => row.clubid,
          },
          {
            field: "scheduled",
            headerName: "Scheduled",
            flex: 3,
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row, column, apiRef) => row.datetimeperiod[0],
            valueFormatter: (value, row, column, apiRef) => ISOtoHuman(value),
          },
        ]),
    // {
    //   field: "budget",
    //   headerName: "Budget/SLC",
    //   flex: isMobile ? null : 2,
    //   align: "center",
    //   headerAlign: "center",
    //   valueGetter: (value, row, column, apiRef) => ({
    //     requested: row.budget.length > 0,
    //     approved: row.status.budget,
    //   }),
    //   renderCell: ({ value }) => (
    //     <Icon
    //       sx={{
    //         color: !value.requested
    //           ? "secondary.main"
    //           : !value.approved
    //             ? "warning.main"
    //             : "success.main",
    //       }}
    //       variant={
    //         !value.requested
    //           ? "remove-rounded"
    //           : !value.approved
    //             ? "refresh-rounded"
    //             : "check"
    //       }
    //     />
    //   ),
    //   display: 'flex',
    // },
    {
      field: "venue",
      headerName: "Venue/SLO",
      flex: isMobile ? null : 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row, column, apiRef) => ({
        requested: row.location.length > 0,
        approved: row.status.room,
      }),
      renderCell: ({ value }) => (
        <Icon
          sx={{
            color: !value.requested
              ? "secondary.main"
              : !value.approved
              ? "warning.main"
              : "success.main",
          }}
          variant={
            !value.requested
              ? "remove-rounded"
              : !value.approved
              ? "refresh-rounded"
              : "check"
          }
        />
      ),
      display: "flex",
    },
    {
      field: "status",
      headerName: "Status",
      flex: isMobile ? null : 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row, column, apiRef) => ({
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
            sx={{ my: 2 }}
          />
        );
      },
    },
  ];

  if (!events) return null;
  return (
    <DataGrid
      autoHeight
      getRowHeight={() => (isMobile ? "auto" : "none")}
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
