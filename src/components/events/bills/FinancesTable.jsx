"use client";

import { useRouter } from "next/navigation";
import Icon from "components/Icon";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Tag from "components/Tag";
import QuickSearchToolbar from "components/QuickSearchToolbar";
import { billsStateLabel } from "utils/formatEvent";

export default function FinancesTable({ events, role }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 5,
      valueGetter: (value, row, column, apiRef) => row?.eventname,
      renderCell: ({ value }) => (
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
          {value}
        </Typography>
      ),
      display: "flex",
    },
    ...(isMobile || !["cc", "slo"].includes(role)
      ? []
      : [
          {
            field: "club",
            headerName: "Club",
            flex: 3,
            valueGetter: (value, row, column, apiRef) => row?.clubid,
            renderCell: ({ value }) => (
              <Typography variant="body2">{value}</Typography>
            ),
            display: "flex",
          },
        ]),
    {
      field: "status",
      headerName: "Status",
      flex: 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row, column, apiRef) => ({
        state: row?.billsStatus?.state,
        status: billsStateLabel(row?.billsStatus?.state),
      }),
      renderCell: ({ value }) => (
        <Tag
          label={value.status.name}
          color={value.status.color}
          sx={{ my: 2 }}
        />
      ),
      display: "flex",
    },
    {
      field: "report_status",
      headerName: "Report Status",
      flex: 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row, column, apiRef) => ({
        submitted: row?.eventReportSubmitted,
      }),
      renderCell: ({ value }) => (
          <Icon
            variant={
              value.submitted === "true"
                ? "check"
                : value.submitted === "old"
                ? "remove"
                : "cancel"
            }
            color={
              value.submitted === "true"
                ? "success.main"
                : value.submitted === "old"
                ? "warning.main"
                : "error.main"
            }
          />
      ),
      display: "flex",
    }
  ];

  if (!events) return null;
  return (
    <DataGrid
      autoHeight
      rows={events}
      columns={columns}
      getRowId={(r) => r.eventid}
      onRowClick={(params) =>
        router.push(
          `/manage/${role === "slo" ? "finances" : "events"}/${
            params.row.eventid
          }`,
        )
      }
      disableRowSelectionOnClick
      initialState={{
        filter: {
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLogicOperator.Or,
          },
        },
        pagination: { paginationModel: { pageSize: 10 } },
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
