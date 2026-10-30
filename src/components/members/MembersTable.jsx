"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Icon from "components/Icon";
import CellLink from "components/CellLink";
import { getFile } from "utils/files";
import { fmtMonthYear } from "utils/membersDates";
import { getUserNameFromUID } from "utils/users";

export default function MembersTable({
  members,
  showClub = false,
  showIcon = true,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "img",
      headerName: "",
      flex: 1,
      valueGetter: (value, row) => ({
        name: row.firstName,
        img: row.img,
      }),
      disableExport: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ value, row }) => (
        <CellLink href={`/manage/members/${row.cid}:${row.uid}`}>
        <Avatar sx={{ height: 32, width: 32, my: 2 }}>
          {value.img ? (
            <Image
              alt={value.name || "User Image"}
              src={getFile(value.img)}
              fill={true}
            />
          ) : null}
        </Avatar>
        </CellLink>
      ),
      display: "flex",
    },
    {
      field: "name",
      headerName: "Name",
      valueGetter: (value, row) => {
        if (!row.firstName && !row.lastName) {
          const { firstName, lastName } = getUserNameFromUID(row.uid);
          return `${firstName} ${lastName}`;
        }
        return `${row.firstName} ${row.lastName}`;
      },
      renderCell: ({ value, row }) => (
        <CellLink href={`/manage/members/${row.cid}:${row.uid}`}>
          <Typography variant="body2">{value}</Typography>
        </CellLink>
      ),
      display: "flex",
      flex: 6,
    },
    ...(isDesktop
      ? [
          {
            field: "email",
            headerName: "Email",
            flex: 8,
            renderCell: ({ value, row }) => (
              <CellLink href={`/manage/members/${row.cid}:${row.uid}`}>
              <Box
                sx={{
                  textTransform: "lowercase",
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                }}
              >
                {value || "Email Not Available"}
              </Box>
              </CellLink>
            ),
            display: "flex",
          },
        ]
      : []),
    ...(showClub
      ? [
          {
            field: "cid",
            headerName: "Club ID",
            flex: 4,
            display: "flex",
          },
        ]
      : []),
    ...(isMobile
      ? []
      : [
          {
            field: "positions",
            headerName: "Positions",
            flex: 8,
            width: 300,
            disableExport: true,
            disableColumnMenu: true,
            sortable: false,
            valueGetter: (value, row) => row.roles,
            renderCell: ({ value, row }) => (
              <CellLink href={`/manage/members/${row.cid}:${row.uid}`}>
              <Box sx={{ width: "100%", height: "100%", p: 1 }}>
                <Stack
                  direction="column"
                  divider={<Divider orientation="horizontal" flexItem />}
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  {value?.map((role, key) => (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                          minWidth: 0, // Allow text to shrink if necessary
                        }}
                      >
                        <span
                          style={{
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role?.name}
                        </span>
                        <Box
                          component="span"
                          sx={{
                            color: "grey.400",
                            display: "inline-block",
                            mx: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          ({fmtMonthYear(role?.startMonth, role?.startYear)} -{" "}
                          {fmtMonthYear(role?.endMonth, role?.endYear)})
                        </Box>
                      </Typography>
                      {showIcon && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            ml: 1,
                            flexShrink: 0,
                          }}
                        >
                          <Tooltip
                            arrow
                            title={
                              role?.approved
                                ? "Approved"
                                : role?.rejected
                                  ? "Rejected"
                                  : "Pending approval"
                            }
                          >
                            <Icon
                              external
                              color={
                                role?.approved
                                  ? "success.main"
                                  : role?.rejected
                                    ? "error.main"
                                    : "warning.main"
                              }
                              variant={
                                role?.approved
                                  ? "eva:checkmark-outline"
                                  : role?.rejected
                                    ? "eva:close-outline"
                                    : "eva:refresh-fill"
                              }
                            />
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
              </CellLink>
            ),
          },
        ]),
  ];

  if (!members) return null;
  return (
    <DataGrid
      autoHeight
      rows={members}
      columns={columns}
      getRowId={(r) => r.mid}
      getRowHeight={() => "auto"}
      onRowClick={(params) => router.push(`/manage/members/${params.row.mid}`)}
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
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      showToolbar
      sx={{
        ".MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
        "& .MuiDataGrid-cell": {
          padding: "8px",
        },
        "& .MuiDataGrid-columnHeader": {
          padding: "0 8px",
        },
      }}
    />
  );
}
