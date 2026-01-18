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

import { fmtMonthYear } from "utils/membersDates";

const showActions = (rows, user) => {
  if (user?.role !== "cc") return false;
  if (rows.length > 0) {
    const allApprovedRejected = rows.every(
      (row) => row.approved || row.rejected,
    );
    return !allApprovedRejected;
  } else return false;
};

// Helper to format row data into YYYY-MM for the input field
const getMonthValue = (month, year) => {
  if (!month || !year) return "";
  return `${year}-${String(month).padStart(2, "0")}`;
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
    isValid: false,      // Default to invalid
    error: "Role name is required", // Default error
  };

  const onAdd = () => {
    // Add new item with default invalid state
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };

  const onUpdate = (newRow) => {
    // Clone row to avoid direct mutation
    const row = { ...newRow };

    // Reset validation state
    row.isValid = true;
    row.error = null;

    if (!row.name || row.name.trim() === "") {
      row.isValid = false;
      row.error = "Role name is required";
    }

    // Clamp Start Year/Month to minYear and 1-12
    [row.startYear, row.startMonth] =
      row.startYear > minYear && row.startMonth >= 1 && row.startMonth <= 12
        ? [row.startYear, row.startMonth]
        : [minYear, 1];

    // Clamp Start to not exceed Current Date
    [row.startYear, row.startMonth] =
      row.startYear > currentYear ||
      (row.startYear === currentYear && row.startMonth > currentMonth)
        ? [currentYear, currentMonth]
        : [row.startYear, row.startMonth];

    // Clamp End Year/Month to minYear and 1-12
    [row.endYear, row.endMonth] =
      row.endYear > minYear && row.endMonth >= 1 && row.endMonth <= 12
        ? [row.endYear, row.endMonth]
        : [null, null];

    // Clamp End to not exceed Current Date
    [row.endYear, row.endMonth] =
      row.endYear > currentYear ||
      (row.endYear === currentYear && row.endMonth > currentMonth)
        ? [null, null]
        : [row.endYear, row.endMonth];

    // Validate Logic: End > Start ---
    if (row.endYear && row.endMonth) {
      const isEndBeforeStart =
        row.endYear < row.startYear ||
        (row.endYear === row.startYear && row.endMonth < row.startMonth);

      if (isEndBeforeStart) {
        row.isValid = false;
        row.error = "End date cannot be before start date";
      }
    }

    const newRows = rows.map((r) => (r.id === row.id ? row : r));
    setRows(newRows);

    const isAllValid = newRows.every((r) => r.isValid);
    setPositionEditing(!isAllValid);
    return row;
  };

  const onDelete = (row) => {
    setRows(rows.filter((r) => r.id !== row.id));
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
      renderCell: (p) => {
        return p.value ? (
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
            {p.value}
          </Typography>
        ) : (
          <Typography sx={{ color: "text.secondary", px: "10px", py: "10px" }}>
            <i>Double click to edit</i>
          </Typography>
        );
      },
      renderEditCell: (params) => (
        <input
          type="text"
          value={params.value || ""}
          placeholder="Role Name (Required)"
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontFamily: "inherit"
          }}
          autoFocus
        />
      ),
      display: "flex",
    },
    {
      field: "start",
      headerName: "Start (YYYY-MM)",
      flex: 2,
      editable: editable,
      valueGetter: (value, row) => getMonthValue(row?.startMonth, row?.startYear),
      valueSetter: (value, row) => {
        if (!value) return row;
        const [y, m] = value.split("-");
        return { ...row, startYear: parseInt(y), startMonth: parseInt(m) };
      },
      renderCell: (params) => (
        <Typography variant="body2" sx={{ px: "5px", py: "10px", textAlign: "center" }}>
          {fmtMonthYear(params.row?.startMonth, params.row?.startYear)}
        </Typography>
      ),
      renderEditCell: (params) => (
        <input
          type="month"
          value={params.value || ""}
          max={maxDateStr}
          min={`${minYear}-01`}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 8,
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
      valueGetter: (value, row) => getMonthValue(row?.endMonth, row?.endYear),
      valueSetter: (value, row) => {
        if (!value) return { ...row, endYear: null, endMonth: null };
        const [y, m] = value.split("-");
        return { ...row, endYear: parseInt(y), endMonth: parseInt(m) };
      },
      renderCell: (params) => (
        <Typography variant="body2" sx={{ px: "5px", py: "10px", textAlign: "center" }}>
          {fmtMonthYear(params.row?.endMonth, params.row?.endYear)}
        </Typography>
      ),
      renderEditCell: (params) => (
        <input
          type="month"
          value={params.value || ""}
          max={maxDateStr}
          min={`${minYear}-01`}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 8,
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
            <Tooltip title={p.row.error || "Valid"} disableHoverListener={p.row.isValid}>
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
            <IconButton onClick={() => onDelete(p.row)} size="small">
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
              align: "center",
              headerName: "",
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
        editMode="row"
        processRowUpdate={onUpdate}
        onProcessRowUpdateError={(error) =>
          triggerToast({
            ...error,
            severity: "error",
          })
        }
        disableRowSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
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