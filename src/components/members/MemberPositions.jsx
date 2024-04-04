"use client";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Tooltip,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Tag from "components/Tag";
import Icon from "components/Icon";

import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { useRouter } from "next/navigation";

const showActions = (rows, user) => {
  if (user?.role !== "cc") return false;
  if (rows.length > 0) {
    const allApprovedRejected = rows.every(
      (row) => row.approved || row.rejected,
    );
    return !allApprovedRejected;
  } else return false;
};

export default function MemberPositions({
  editable,
  rows = [],
  setRows = console.log,
  member = {},
  positionEditing = false,
  setPositionEditing = console.log,
}) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const minYear = 2010;

  // position item template
  const emptyPositionItem = {
    name: null,
    startYear: new Date().getFullYear(),
    endYear: null,
  };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };
  const onUpdate = (row) => {
    row.startYear =
      parseInt(row.startYear) > minYear ? parseInt(row.startYear) : minYear;
    row.startYear =
      row.startYear > new Date().getFullYear()
        ? new Date().getFullYear()
        : row.startYear;

    row.endYear =
      parseInt(row.endYear) > minYear ? parseInt(row.endYear) : minYear;
    row.endYear = row.endYear > new Date().getFullYear() ? "" : row.endYear;
    row.endYear = row.endYear >= row.startYear ? row.endYear : "";

    const newRows = rows.map((r) => {
      if (r.id === row.id) return row;
      return r;
    });
    setRows(newRows);
    return row;
  };
  const onDelete = (row) => {
    setRows(rows.filter((r) => r.id !== row.id));
  };

  // if editing, set position editing to true
  const onEdit = () => {
    setPositionEditing(true);
  };
  // if not editing, set position editing to false
  const onEditStop = () => {
    setPositionEditing(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Role",
      flex: isMobile ? null : 4,
      editable: editable,
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
          <Typography color="text.secondary">
            <i>Double click to edit</i>
          </Typography>
        ),
    },
    {
      field: "startYear",
      headerName: "Start Year",
      flex: isMobile ? null : 2,
      editable: editable,
    },
    {
      field: "endYear",
      headerName: "End Year",
      valueGetter: ({ row }) => row.endYear || "-",
      flex: isMobile ? null : 2,
      editable: editable,
    },
    // if editing, show delete button
    ...(editable
      ? [
          {
            field: "action",
            align: "center",
            headerName: "",
            width: 50,
            renderCell: (p) => (
              <IconButton onClick={() => onDelete(p)} size="small">
                <Icon
                  color="error.main"
                  variant="delete-forever-outline"
                  sx={{ height: 16, width: 16 }}
                />
              </IconButton>
            ),
          },
        ]
      : [
          {
            field: "approved",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: isMobile ? null : 2,
            valueGetter: ({ row }) => ({
              approved: row.approved,
              rejected: row.rejected,
            }),
            renderCell: ({ value: { approved, rejected } }) => (
              <Tag
                label={
                  approved ? "Approved" : rejected ? "Rejected" : "Pending"
                }
                color={approved ? "success" : rejected ? "error" : "warning"}
                sx={{ my: 2 }}
              />
            ),
          },

          // if not editing and if user is cc, show approve button
          ...(showActions(rows, user)
            ? [
                {
                  field: "actions",
                  align: "center",
                  headerName: "",
                  width: 100,
                  valueGetter: ({ row }) => ({
                    approved: row.approved,
                    rejected: row.rejected,
                    rid: row.rid,
                  }),
                  renderCell: ({ value: { approved, rejected, rid } }) => (
                    <>
                      {approved || rejected ? null : (
                        <>
                          <ApproveButton rid={rid} member={member} />
                          <Box sx={{ mx: 1 }} />
                          <RejectButton rid={rid} member={member} />
                        </>
                      )}
                    </>
                  ),
                },
              ]
            : []),
        ]),
  ];

  return (
    <>
      {editable ? (
        <Button size="small" variant="outlined" onClick={onAdd} sx={{ mb: 1 }}>
          <Icon variant="add" mr={1} />
          Add Item
        </Button>
      ) : null}

      <DataGrid
        autoHeight
        getRowHeight={() => (isMobile ? "auto" : "none")}
        rows={rows}
        columns={columns}
        editMode="row"
        processRowUpdate={onUpdate}
        disableRowSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onRowEditStart={onEdit}
        onRowEditStop={onEditStop}
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 15]}
      />
    </>
  );
}

function ApproveButton({ member, rid }) {
  const router = useRouter();
  const { triggerToast } = useToast();

  const [loading, setLoading] = useState(false);

  const onApprove = async (rid) => {
    const data = {
      cid: member.cid,
      uid: member.uid,
      rid: rid,
    };

    let res = await fetch("/actions/members/approve", {
      method: "POST",
      body: JSON.stringify({ memberInput: data }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & refresh server
      triggerToast({
        title: "Success!",
        messages: ["Membership approved."],
        severity: "success",
      });
      setLoading(false);
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <Tooltip arrow title="Approve">
      <IconButton
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await onApprove(rid);
        }}
        size="small"
        sx={{ border: 1, borderColor: "success.main" }}
      >
        {loading ? (
          <CircularProgress color="success" size={16} />
        ) : (
          <Icon
            color="success.main"
            variant="done"
            sx={{ height: 16, width: 16 }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}

function RejectButton({ member, rid }) {
  const router = useRouter();
  const { triggerToast } = useToast();

  const [loading, setLoading] = useState(false);

  const onReject = async (rid) => {
    const data = {
      cid: member.cid,
      uid: member.uid,
      rid: rid,
    };

    let res = await fetch("/actions/members/reject", {
      method: "POST",
      body: JSON.stringify({ memberInput: data }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & refresh server
      triggerToast({
        title: "Success in Rejecting!",
        messages: ["Membership rejected."],
        severity: "success",
      });
      setLoading(false);
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <Tooltip arrow title="Reject">
      <IconButton
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await onReject(rid);
        }}
        size="small"
        sx={{ border: 1, borderColor: "error.main" }}
      >
        {loading ? (
          <CircularProgress color="error" size={16} />
        ) : (
          <Icon
            color="error.main"
            variant="close"
            sx={{ height: 16, width: 16 }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
