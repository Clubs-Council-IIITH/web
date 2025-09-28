"use client";

import { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useToast } from "components/Toast";

import { getActiveClubIds } from "actions/clubs/ids/server_action";

export default function UserMemberships({ rows = [] }) {
  const { triggerToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // fetch cid -> club name mapping
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await getActiveClubIds();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setClubs(
          res.data.reduce((acc, { cid, name }) => {
            acc[cid] = name;
            return acc;
          }, {}),
        );
      }
    })();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Role",
      flex: isMobile ? null : 7,
      renderCell: (p) => {
        return (
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
        );
      },
      display: "flex",
    },
    {
      field: "cid",
      headerName: "Club/Student Body",
      flex: isMobile ? null : 5,
      renderCell: (p) => {
        return (
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
            {clubs[p.value]}
          </Typography>
        );
      },
      display: "flex",
    },
    {
      field: "startYear",
      headerName: "Start Year",
      headerAlign: "center",
      align: "center",
      flex: isMobile ? null : 3,
    },
    {
      field: "endYear",
      headerName: "End Year",
      headerAlign: "center",
      align: "center",
      valueGetter: (value, row, column, apiRef) => row.endYear || "-",
      flex: isMobile ? null : 3,
    },
  ];

  return (
    <>
      {rows?.length ? (
        <DataGrid
          autoHeight
          getRowHeight={() => (isMobile ? "auto" : "none")}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row.rid}
          initialState={{
            sorting: {
              sortModel: [{ field: "endYear", sort: "asc" }],
            },
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            // disable cell selection style
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      ) : (
        "No Memberships Found!"
      )}
    </>
  );
}
