"use client";

import { useRouter } from "next/navigation";

import { Typography, TextField, Box, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { ISOtoHuman } from "utils/formatTime";
import { stateLabel } from "utils/formatEvent";

import Tag from "components/Tag";
import Icon from "components/Icon";
import QuickSearchToolbar from "components/QuickSearchToolbar";

function FilterTextInputValue(props) {
  const { item, applyValue } = props;

  const handleFilterChange = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        pl: "20px",
      }}
    >
      <TextField
        label="Enter text"
        value={item.value || ""}
        onChange={handleFilterChange}
        variant="standard"
      />
    </Box>
  );
}

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
            headerName: "Event Code",
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
      renderCell: ({ value, row }) =>
        value ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {row.sponsor && row.sponsor.length > 0 ? (
              <Tooltip title="Event has sponsors" arrow>
                <Icon
                  sx={{
                    mr: 0.5,
                    flexShrink: 0,
                  }}
                  variant={"paid-rounded"}
                  color="#FFC046"
                />
              </Tooltip>
            ) : row.budget && row.budget.length > 0 ? (
              <Tooltip title="Event requires budget" arrow>
                <Icon
                  sx={{
                    mr: 0.5,
                    flexShrink: 0,
                  }}
                  variant={"paid-rounded"}
                />
              </Tooltip>
            ) : null}
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0, // Allow text to shrink
              }}
            >
              {value}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </Typography>
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
            renderCell: ({ value }) => (
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </Typography>
            ),
            display: "flex",
          },
          {
            field: "scheduled",
            headerName: "Scheduled",
            flex: 3,
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row, column, apiRef) => row.datetimeperiod[0],
            valueFormatter: (value, row, column, apiRef) => ISOtoHuman(value),
            renderCell: ({ formattedValue }) => (
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {formattedValue}
              </Typography>
            ),
            display: "flex",
          },
        ]),
    {
      field: "venue",
      headerName: "Venue",
      flex: isMobile ? null : 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row, column, apiRef) => ({
        requested: row.location.length > 0,
        approved: row.status.room,
      }),
      renderCell: ({ value }) => (
        <Tooltip
          title={
            !value.requested
              ? "No venue requested"
              : !value.approved
              ? "Venue requested, pending approval"
              : "Venue approved"
          }
          arrow
        >
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
        </Tooltip>
      ),
      display: "flex",
      sortComparator: (v1, v2) => {
        return v1.requested - v2.requested || v1.approved - v2.approved;
      },
      filterable: false,
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
        end: row.datetimeperiod[1],
      }),
      renderCell: ({ value }) => {
        // change state to 'completed' if it has been approved and is in the past
        if (value.state === "approved" && new Date(value.start) < new Date()) {
          if (new Date(value.end) < new Date()) value.state = "completed";
          else value.state = "ongoing";
        }

        return (
          <Tag
            label={stateLabel(value.state).shortName}
            color={stateLabel(value.state).color}
            sx={{
              my: 2,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
        );
      },
      sortComparator: (v1, v2) => {
        return v1.state.localeCompare(v2.state);
      },
      // Custom filter
      filterOperators: [
        {
          label: "contains",
          value: "contains",
          InputComponent: FilterTextInputValue,
          InputComponentProps: { type: "text" },
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) {
              return null;
            }
            return (value) => {
              const curr_state =
                value.state === "approved"
                  ? new Date(value.start) < new Date()
                    ? new Date(value.end) < new Date()
                      ? "completed approved"
                      : "ongoing approved"
                    : "approved"
                  : stateLabel(value.state).shortName.toLowerCase();

              return curr_state.includes(filterItem.value.toLowerCase());
            };
          },
        },
        {
          label: "does not contain",
          value: "does not contain",
          InputComponent: FilterTextInputValue,
          InputComponentProps: { type: "number" },
          getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) {
              return null;
            }
            return (value) => {
              const curr_state =
                value.state === "approved"
                  ? new Date(value.start) < new Date()
                    ? new Date(value.end) < new Date()
                      ? "completed approved"
                      : "ongoing approved"
                    : "approved"
                  : stateLabel(value.state).shortName.toLowerCase();

              return !curr_state.includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
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
