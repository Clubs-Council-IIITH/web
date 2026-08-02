"use client"

import { DataGrid } from "@mui/x-data-grid";
import { Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfile } from "utils/fetchData";

export default function UsersTable({ achievement }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const users = await Promise.all(
        achievement.userids.map((uid) => getUserProfile(uid))
      );
      setUsers(users);
    }
    loadUsers();
  }, [achievement.userids]);

const columns = [
  {
    field: "image",
    headerName: "",
    width: 70,
    sortable: false,
    filterable: false,
    renderCell: (p) => (
      <Avatar
        src={p.row.image}
      />
    ),
  },
  {
    field: "name",
    headerName: "Participants",
    flex: 1,
    renderCell: (p) => {
      const firstName = p.row.firstName;
      const lastName = p.row.lastName;
      return (
        <Typography
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              msWordBreak: "break-all",
              wordBreak: "break-all",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
              padding: "4px 8px",
            }}
        >
          {firstName} {lastName}
        </Typography>
      )
    }
  },
];

  return (
    <DataGrid
      rows={users}
      columns={columns}
      getRowId={(row) => row.uid}
      autoHeight
      hideFooter
      disableRowSelectionOnClick
      disableColumnMenu
    />
  );
}