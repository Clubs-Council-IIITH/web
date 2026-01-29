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

const [currentMonth, currentYear] = [
  new Date().getMonth() + 1,
  new Date().getFullYear(),
];

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
    startYear: currentYear,
    endYear: null,
    startMonth: currentMonth,
    endMonth: null,
  };

  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };

  const onUpdate = (row) => {
    // sanitize start
    if (!row.startMonth && row.startYear) {
      row.startMonth = 1; // ensure month exists
    }

    // sanitize end
    if (row.endYear && !row.endMonth) {
      row.endMonth = 1; // ensure month exists
    }

    // validate ordering
    if (row.endYear) {
      const startVal = row.startYear * 12 + row.startMonth;
      const endVal = row.endYear * 12 + row.endMonth;

      if (endVal <= startVal) {
        row.endYear = null;
        row.endMonth = null;
      }
  }

    const newRows = rows.map((r) => (r.id === row.id ? row : r));
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
      field: "start",
      headerName: "Start (YYYY-MM)",
      flex: 2,
      editable: editable,

      valueGetter: (value, row) =>
        fmtMonthYear(row?.startMonth, row?.startYear),

      renderEditCell: (params) => {
        const { row, api, id } = params;

        const defaultValue =fmtMonthYear(row?.startMonth, row?.startYear);

        return (
          <input
            type="month"
            defaultValue={defaultValue}

            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;

              const [y, m] = v.split("-");

              api.setEditCellValue({ id, field: "startYear", value: parseInt(y, 10) });
              api.setEditCellValue({ id, field: "startMonth", value: parseInt(m, 10) });
            }}

            onBlur={() => {
              api.stopRowEditMode({ id });
            }}

            min="2010-01"
            max={`${currentYear}-${currentMonth+1}`}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        );
      },
    },
    {
      field: "end",
      headerName: "End (YYYY-MM)",
      flex: 2,
      editable: editable,

      valueGetter: (value, row) =>
        fmtMonthYear(row?.endMonth, row?.endYear),

      renderEditCell: (params) => {
        const { row, api, id } = params;

        const defaultValue = fmtMonthYear(row?.endMonth, row?.endYear);

        return (
          <input
            type="month"
            defaultValue={defaultValue}

            onChange={(e) => {
              const v = e.target.value;

              if (!v) {
                api.setEditCellValue({ id, field: "endYear", value: null });
                api.setEditCellValue({ id, field: "endMonth", value: null });
                return;
              }

              const [y, m] = v.split("-");

              api.setEditCellValue({ id, field: "endYear", value: parseInt(y, 10) });
              api.setEditCellValue({ id, field: "endMonth", value: parseInt(m, 10) });
            }}

            onBlur={() => {
              api.stopRowEditMode({ id });
            }}

            min="2010-01"
            max={`${currentYear}-${currentMonth+1}`}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        );
      },
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
