"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { Box, Avatar, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import Icon from "components/Icon";
import QuickSearchToolbar from "components/QuickSearchToolbar";

import { getFile } from "utils/files";

export default function MembersTable({ members, showClub = false }) {
  const router = useRouter();

  const columns = [
    {
      field: "img",
      headerName: "",
      flex: 1,
      valueGetter: ({ row }) => ({ name: row.firstName, img: row.img }),
      renderCell: ({ value }) => (
        <Avatar sx={{ height: 32, width: 32 }}>
          {value.img ? (
            <Image alt={value.name} src={getFile(value.img)} fill={true} />
          ) : null}
        </Avatar>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      valueGetter: ({ row }) => `${row.firstName} ${row.lastName}`,
      flex: 6,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 8,
      renderCell: ({ value }) => (
        <Box textTransform="lowercase" fontSize="0.9em" fontFamily="monospace">
          {value}
        </Box>
      ),
    },
    ...(showClub
      ? [
          {
            field: "cid",
            headerName: "Club",
            flex: 4,
          },
        ]
      : []),
    {
      field: "positions",
      headerName: "Positions",
      flex: 8,
      valueGetter: ({ row }) => row.roles,
      renderCell: ({ value }) => (
        <Stack direction="column">
          {value?.map((role, key) => (
            <Typography
              key={key}
              variant="body2"
              my={1}
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
              }}
            >
              {role?.name}
              <Box color="grey.400" display="inline-block" mx={0.5}>
                ({role?.startYear} - {role?.endYear || "present"})
              </Box>
              <Tooltip
                arrow
                title={role?.approved ? "Approved" : "Pending approval"}
              >
                <Icon
                  external
                  color={role?.approved ? "success.main" : "warning.main"}
                  variant={
                    role?.approved
                      ? "eva:checkmark-outline"
                      : "eva:refresh-fill"
                  }
                />
              </Tooltip>
            </Typography>
          ))}
        </Stack>
      ),
    },
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
