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
import { fmtMonthYear } from "utils/membersDates";

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
  setPositionEditing = console.log,
}) {
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const minYear = 2010;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const maxDateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  const emptyPositionItem = {
    name: null,
    startYear: currentYear,
    endYear: null,
    startMonth: currentMonth,
    endMonth: null,
    isValid: false,
    error: "Role name is required",
  };

  const onAdd = () => {
    const maxId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) : -1;
    const newId = maxId + 1;
    setRows([...rows, { id: newId, ...emptyPositionItem }]);
    const isAllValid = rows.every((r) => r.isValid);
    setPositionEditing(!isAllValid);
  };

  const onUpdate = (newRow) => {
    const row = { ...newRow };
    row.isValid = true;
    row.error = null;

    if (!row.name || row.name.trim() === "") {
      row.isValid = false;
      row.error = "Role name is required";
    }

    // Ensure years are within bounds, but leave months as they are
    if (row.startYear < minYear) row.startYear = minYear;

    // Only clamp if the month is actually set
    if (
      row.startMonth &&
      (row.startYear > currentYear ||
        (row.startYear === currentYear && row.startMonth > currentMonth))
    ) {
      row.startYear = currentYear;
      row.startMonth = currentMonth;
    }

    // Handle End Date Logic
    if (row.endYear) {
      if (row.endYear < minYear) {
        row.endYear = null;
        row.endMonth = null;
      }

      if (row.endYear && row.endMonth) {
        const isEndBeforeStart =
          row.endYear < row.startYear ||
          (row.endYear === row.startYear && row.endMonth < row.startMonth);

        if (isEndBeforeStart) {
          row.isValid = false;
          row.error = "End date cannot be before start date";
        }
      }
    }

    const newRows = rows.map((r) => (r.id === row.id ? row : r));
    const isAllValid = newRows.every((r) => r.isValid);
    setPositionEditing(!isAllValid);
    setRows(newRows);
    return row;
  };

  const onDelete = (row) => {
    const newRows = rows.filter((r) => r.id !== row.id);
    const isAllValid = newRows.every((r) => r.isValid);
    setPositionEditing(newRows.length === 0 || !isAllValid);
    setRows(newRows);
  };

  const onEdit = () => setPositionEditing(true);
  const onEditStop = () => setPositionEditing(false);

  const columns = [
    {
      field: "name",
      headerName: "Role",
      width: 150,
      flex: isMobile ? null : 4,
      editable: editable,
      renderCell: (p) => (
        <Typography
          variant="body2"
          sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            px: "10px",
            py: "10px",
          }}
        >
          {p.value || (
            <Box
              component="span"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              Double click to edit
            </Box>
          )}
        </Typography>
      ),
      renderEditCell: (params) => (
        <input
          type="text"
          defaultValue={params.value || ""}
          placeholder="Role Name (Required)"
          // Use ref to focus immediately for Cell Editing
          ref={(input) => input && input.focus()}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          // Commit change on blur (click away)
          onBlur={() => {
            params.api.stopCellEditMode({ id: params.id, field: params.field });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              params.api.stopCellEditMode({
                id: params.id,
                field: params.field,
              });
            }
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
        />
      ),
      display: "flex",
    },
    {
      field: "start",
      headerName: "Start (YYYY-MM)",
      flex: 2,
      editable: editable,
      valueGetter: (value, row) =>
        fmtMonthYear(row?.startMonth, row?.startYear),
      valueSetter: (value, row) => {
        if (!value) return row; // Don't clear start date on empty, or handle as you wish
        const [y, m] = value.split("-");
        const y_num = parseInt(y, 10);
        const m_num = Math.min(12, Math.max(1, parseInt(m, 10)));
        if (isNaN(y_num) || isNaN(m_num)) return row;
        return { ...row, startYear: y_num, startMonth: m_num };
      },
      renderEditCell: (params) => (
        <input
          type="month"
          defaultValue={fmtMonthYear(
            params.row.startMonth,
            params.row.startYear,
            true,
          )}
          ref={(input) => input && input.focus()}
          onChange={(e) => {
            // This triggers valueSetter automatically
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            });
          }}
          onBlur={() => {
            params.api.stopCellEditMode({ id: params.id, field: params.field });
          }}
          min="2010-01"
          max={maxDateStr}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
        />
      ),
      display: "flex",
    },
    {
      field: "end",
      headerName: "End (YYYY-MM)",
      flex: 2,
      editable: editable,

      valueGetter: (value, row) => fmtMonthYear(row?.endMonth, row?.endYear),
      valueSetter: (value, row) => {
        if (!value) {
          return { ...row, endYear: null, endMonth: null };
        }
        const [y, m] = value.split("-");
        const y_num = parseInt(y, 10);
        const m_num = Math.min(12, Math.max(1, parseInt(m, 10)));
        if (isNaN(y_num) || isNaN(m_num)) {
          return { ...row, endYear: null, endMonth: null };
        }
        return { ...row, endYear: y_num, endMonth: m_num };
      },
      renderEditCell: (params) => (
        <input
          type="month"
          defaultValue={fmtMonthYear(
            params.row.endMonth,
            params.row.endYear,
            true,
          )}
          ref={(input) => input && input.focus()}
          onChange={(e) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            });
          }}
          onBlur={() => {
            params.api.stopCellEditMode({ id: params.id, field: params.field });
          }}
          min="2010-01"
          max={maxDateStr}
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
        />
      ),
      display: "flex",
    },
    ...(editable
      ? [
          {
            field: "isValid",
            type: "boolean",
            headerName: "Valid?",
            align: "center",
            width: 80,
            renderCell: (p) => (
              <Tooltip
                title={p.row.error || "Valid"}
                disableHoverListener={p.row.isValid}
              >
                <span>
                  <Icon
                    color={p.row.isValid ? "success.main" : "error.main"}
                    variant={p.row.isValid ? "check-circle" : "cancel"}
                    sx={{ height: 20, width: 20 }}
                  />
                </span>
              </Tooltip>
            ),
            display: "flex",
            disableColumnMenu: true,
            sortable: false,
          },
          {
            field: "action",
            align: "center",
            headerName: "",
            width: 50,
            renderCell: (p) => (
              <IconButton
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p.row);
                }}
                size="small"
              >
                <Icon
                  color="error.main"
                  variant="delete-forever-outline"
                  sx={{ height: 16, width: 16 }}
                />
              </IconButton>
            ),
            display: "flex",
            disableColumnMenu: true,
            sortable: false,
          },
        ]
      : [
          {
            field: "approved",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: isMobile ? null : 2,
            valueGetter: (value, row) => ({
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
          ...(showActions(rows, user)
            ? [
                {
                  field: "actions",
                  type: "actions",
                  align: "center",
                  width: 100,
                  valueGetter: (value, row) => ({
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
        processRowUpdate={onUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        onProcessRowUpdateError={(error) =>
          triggerToast({
            ...error,
            severity: "error",
          })
        }
        disableRowSelectionOnClick
        onRowEditStart={onEdit}
        onRowEditStop={onEditStop}
        sx={{
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
      triggerToast({
        title: "Success!",
        messages: ["Membership approved."],
        severity: "success",
      });
      setLoading(false);
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
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
      triggerToast({
        title: "Success in Rejecting!",
        messages: ["Membership rejected."],
        severity: "success",
      });
      setLoading(false);
      router.refresh();
    } else {
      triggerToast({ ...res.error, severity: "error" });
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
