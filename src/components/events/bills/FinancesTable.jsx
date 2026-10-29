"use client";

import { useRouter } from "next/navigation";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Icon from "components/Icon";
import Tag from "components/Tag";
import CellLink from "components/CellLink";
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
      valueGetter: (value, row) => row?.eventname,
      renderCell: ({ value, row }) => {
        const financeLink = getFinanceLink({role, row})
        return (
          <CellLink href={financeLink}>
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
          </CellLink>
      )
    },
      display: "flex",
    },
    ...(isMobile || !["cc", "slo"].includes(role)
      ? []
      : [
          {
            field: "club",
            headerName: "Club",
            flex: 3,
            valueGetter: (value, row) => row?.clubid,
            renderCell: ({ value, row }) => {
              const financeLink = getFinanceLink({role, row})
              return (
                <CellLink href={financeLink}>
                  <Typography variant="body2">{value}</Typography>
                </CellLink>
              )
            },
            display: "flex",
          },
        ]),
    {
      field: "status",
      headerName: "Status",
      flex: 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => ({
        state: row?.billsStatus?.state,
        status: billsStateLabel(row?.billsStatus?.state),
      }),
      disableExport: true,
      renderCell: ({ value, row }) => {
        const financeLink = getFinanceLink({role, row})
        return (
          <CellLink href={financeLink}>
            <Tag
              label={value.status.name}
              color={value.status.color}
              sx={{ my: 2 }}
            />
          </CellLink>
        )
      },
      display: "flex",
    },
    {
      field: "report_status",
      headerName: "Report Status",
      flex: 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row?.eventReportSubmitted,
      renderCell: ({ value, row }) => {
        const financeLink = getFinanceLink({role, row})
        return (
          <CellLink href={financeLink}>
            <Icon
              variant={
              value === "true" ? "check" : value === "old" ? "remove" : "cancel"
            }
            color={
              value === "true"
                ? "success.main"
                : value === "old"
                  ? "warning.main"
                  : "error.main"
            }
          />
          </CellLink>
        )
      },
      display: "flex",
    },
  ];

  if (!events) return null;
  return (
    <DataGrid
      autoHeight
      rows={events}
      columns={columns}
      getRowId={(r) => r.eventid}
      onRowClick={(params) => {
        router.push(getFinanceLink({role, row: params.row}))
      }}
      // getRowClassName={(params) =>
      //   ["rejected", "not_submitted"].includes(params.row.billsStatus?.state)
      //     ? "disabled-row"
      //     : ""
      // }
      getRowClassName={(params) => {
        if (role === "slo" && params.row.billsStatus?.state === "submitted") {
          return "";
        } else if (
          role === "club" &&
          ["rejected", "not_submitted"].includes(params.row.billsStatus?.state)
        ) {
          return "";
        } else {
          return "disabled-row";
        }
      }}
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
      showToolbar
      sx={{
        ".MuiDataGrid-cell:focus": { outline: "none" },
        "& .MuiDataGrid-row:hover": { cursor: "pointer" },
        "& .MuiDataGrid-row.disabled-row:hover": { cursor: "default" },
      }}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}

function getFinanceLink({role, row}) {
  const status = row.billsStatus?.state
  if (role === "slo") {
    if (status === "submitted")
      return `/manage/finances/${row.eventid}`;
    else 
      return `/manage/events/${row.eventid}`;
  } else if (role === "club") {
    if (status === "not_submitted" || status === "rejected")
      return `/manage/events/${row.eventid}/bills`
    else 
      return `/manage/events/${row.eventid}`
  } else {
    return `/manage/events/${row.eventid}`
  }
}