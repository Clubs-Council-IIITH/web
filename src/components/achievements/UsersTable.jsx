"use client"

import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfile } from "utils/fetchData";
import UserImage from "components/users/UserImage";

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
      <UserImage 
        image={p.row.img}
        name={p.row.firstName}
        gender={p.row.gender}
        width={40}
        height={40}
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
        <Link
          href={`/profile/${p.row.uid}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            width: "100%",
          }}
        >
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
        </Link>
      );
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