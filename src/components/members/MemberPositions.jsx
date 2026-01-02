"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "components/AuthProvider";
import Icon from "components/Icon";
import Tag from "components/Tag";
import { useToast } from "components/Toast";

import { approveMemberAction } from "actions/members/approve/server_action";
import { rejectMemberAction } from "actions/members/reject/server_action";

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
    startMy: [new Date().getMonth() + 1, new Date().getFullYear()],
    endMy: null,
  };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };
  const onUpdate = (row) => {
    // normalize startMy
    let sm, sy;
    if (Array.isArray(row.startMy)) {
      sm = parseInt(row.startMy[0]);
      sy = parseInt(row.startMy[1]);
    } else {
      sm = new Date().getMonth() + 1;
      sy = new Date().getFullYear();
    }
    sm = Math.min(12, Math.max(1, sm || 1));
    sy = Math.min(new Date().getFullYear(), Math.max(minYear, sy || minYear));
    row.startMy = [sm, sy];

    // normalize endMy
    let em = null,
      ey = null;
    if (Array.isArray(row.endMy)) {
      em = parseInt(row.endMy[0]);
      ey = parseInt(row.endMy[1]);
      em = Math.min(12, Math.max(1, em || 1));
      ey = Math.min(new Date().getFullYear(), Math.max(minYear, ey || minYear));
      row.endMy = [em, ey];
    }
    // ordering: if end < start, clear end (compare year, then month)
    if (row.endMy) {
      if (
        row.endMy[1] < row.startMy[1] ||
        (row.endMy[1] === row.startMy[1] && row.endMy[0] < row.startMy[0])
      ) {
        row.endMy = null;
      }
    }

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
      width: 150,
      flex: isMobile ? null : 4,
      editable: editable,
      renderCell: (p) => {
        return p.value ? (
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
              px: "10px",
              py: "10px",
            }}
          >
            {p.value}
          </Typography>
        ) : (
          <Typography
            sx={{
              color: "text.secondary",
              px: "10px",
              py: "10px",
            }}
          >
            <i>Double click to edit</i>
          </Typography>
        );
      },
      display: "flex",
    },
    {
      field: "startMy",
      headerName: "Start (MM-YYYY)",
      flex: isMobile ? null : 2,
      editable: editable,
      valueGetter: (value, row) => row.startMy,
      renderCell: (p) => {
        const v = p.value;
        const text = Array.isArray(v)
          ? `${String(v[0]).padStart(2, "0")}-${v[1]}`
          : "";
        return (
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              px: "5px",
              py: "10px",
              justifyContent: "center",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {text}
          </Typography>
        );
      },
      renderEditCell: (params) => {
        const { api, id, row } = params;
        const now = new Date();
        const current = Array.isArray(row.startMy)
          ? [parseInt(row.startMy[0]) || now.getMonth() + 1, parseInt(row.startMy[1]) || now.getFullYear()]
          : [now.getMonth() + 1, now.getFullYear()];

        const clampMonth = (m) => Math.min(12, Math.max(1, m));
        const clampYear = (y) => Math.min(new Date().getFullYear(), Math.max(2010, y));

        const onMonthChange = (e) => {
          let mm = parseInt(e.target.value);
          if (isNaN(mm)) return; // ignore non-numeric input
          mm = clampMonth(mm);
          api.setEditCellValue({ id, field: "startMy", value: [mm, current[1]] }, e);
        };

        const onYearChange = (e) => {
          let yy = parseInt(e.target.value);
          if (isNaN(yy)) return; // ignore non-numeric input
          yy = clampYear(yy);
          api.setEditCellValue({ id, field: "startMy", value: [current[0], yy] }, e);
        };

        return (
          <Box sx={{ display: "flex", gap: 1, width: "100%", alignItems: "center" }}>
            <input
              type="number"
              min={1}
              max={12}
              defaultValue={current[0]}
              placeholder="MM"
              onChange={onMonthChange}
              style={{ width: "45%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <input
              type="number"
              min={2010}
              max={new Date().getFullYear()}
              defaultValue={current[1]}
              placeholder="YYYY"
              onChange={onYearChange}
              style={{ width: "55%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </Box>
        );
      },
      display: "flex",
    },
    {
      field: "endMy",
      headerName: "End (MM-YYYY)",
      valueGetter: (value, row) => row.endMy || null,
      flex: isMobile ? null : 2,
      editable: editable,
      renderCell: (p) => {
        const v = p.value;
        const text = Array.isArray(v)
          ? `${String(v[0]).padStart(2, "0")}-${v[1]}`
          : "-";
        return (
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              px: "5px",
              py: "10px",
              justifyContent: "center",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {text}
          </Typography>
        );
      },
      renderEditCell: (params) => {
        const { api, id, row } = params;
        const now = new Date();
        const isSet = Array.isArray(row.endMy);
        const current = isSet
          ? [parseInt(row.endMy[0]) || 1, parseInt(row.endMy[1]) || now.getFullYear()]
          : ["", ""]; // blank inputs indicate present/null

        const clampMonth = (m) => Math.min(12, Math.max(1, m));
        const clampYear = (y) => Math.min(new Date().getFullYear(), Math.max(2010, y));

        const onMonthChange = (e) => {
          const raw = e.target.value;
          if (raw === "" || raw == null) {
            api.setEditCellValue({ id, field: "endMy", value: null }, e);
            return;
          }
          let mm = parseInt(raw);
          if (isNaN(mm)) return; // ignore non-numeric input
          mm = clampMonth(mm);
          const yy = isSet ? (parseInt(row.endMy[1]) || now.getFullYear()) : now.getFullYear();
          api.setEditCellValue({ id, field: "endMy", value: [mm, yy] }, e);
        };

        const onYearChange = (e) => {
          const raw = e.target.value;
          if (raw === "" || raw == null) {
            api.setEditCellValue({ id, field: "endMy", value: null }, e);
            return;
          }
          let yy = parseInt(raw);
          if (isNaN(yy)) return; // ignore non-numeric input
          yy = clampYear(yy);
          const mm = isSet ? (parseInt(row.endMy[0]) || 1) : 1;
          api.setEditCellValue({ id, field: "endMy", value: [mm, yy] }, e);
        };

        return (
          <Box sx={{ display: "flex", gap: 1, width: "100%", alignItems: "center" }}>
            <input
              type="number"
              min={1}
              max={12}
              defaultValue={isSet ? current[0] : ""}
              placeholder="MM"
              onChange={onMonthChange}
              style={{ width: "45%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <input
              type="number"
              min={2010}
              max={new Date().getFullYear()}
              defaultValue={isSet ? current[1] : ""}
              placeholder="YYYY"
              onChange={onYearChange}
              style={{ width: "55%", padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </Box>
        );
      },
      display: "flex",
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
            display: "flex",
          },
        ]
      : [
          {
            field: "approved",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: isMobile ? null : 2,
            valueGetter: (value, row, column, apiRef) => ({
              approved: row.approved,
              approvalTime: row.approvalTime,
              rejected: row.rejected,
              rejectionTime: row.rejectionTime,
            }),
            disableExport: true,
            renderCell: ({
              value: { approved, approvalTime, rejected, rejectionTime },
            }) => (
              <Tooltip
                title={
                  approved
                    ? approvalTime || "No Information Available"
                    : rejected
                      ? rejectionTime || "No Information Available"
                      : null
                }
                placement="left-start"
              >
                <span>
                  <Tag
                    label={
                      approved ? "Approved" : rejected ? "Rejected" : "Pending"
                    }
                    color={
                      approved ? "success" : rejected ? "error" : "warning"
                    }
                    sx={{ my: 2 }}
                  />
                </span>
              </Tooltip>
            ),
            display: "flex",
          },

          // if not editing and if user is cc, show approve button
          ...(showActions(rows, user)
            ? [
                {
                  field: "actions",
                  align: "center",
                  headerName: "",
                  width: 100,
                  valueGetter: (value, row, column, apiRef) => ({
                    approved: row.approved,
                    rejected: row.rejected,
                    rid: row.rid,
                  }),
                  disableExport: true,
                  disableColumnMenu: true,
                  sortable: false,
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
                  display: "flex",
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
        getRowHeight={() => "auto"}
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

    let res = await approveMemberAction(data);

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

    let res = await rejectMemberAction(data);

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
