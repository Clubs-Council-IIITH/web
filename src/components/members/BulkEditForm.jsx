"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";

import { useAuth } from "components/AuthProvider";
import ConfirmDialog from "components/ConfirmDialog";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { getActiveClubIds } from "actions/clubs/ids/server_action";
import { createMemberAction } from "actions/members/create/server_action";
import { currentMembersAction } from "actions/members/current/server_action";
import { editMemberAction } from "actions/members/edit/server_action";
import { getUsers } from "actions/users/get/server_action";

export default function BulkEdit({ mode = "add" }) {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [expDialog, setExpDialog] = useState(true);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { newMembers: [] },
  });
  const { triggerToast } = useToast();
  const [allValid, setAllValid] = useState(false);

  const [selectedClub, setSelectedClub] = useState(user?.uid || "");
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [existingMembers, setExistingMembers] = useState([]);
  const [fullMembers, setFullMembers] = useState([]);

  const disableClubSelector = user?.role === "club";

  const fetchClubs = async () => {
    setClubsLoading(true);
    try {
      const res = await getActiveClubIds();
      if (res.ok) {
        setClubs(res.data);
      } else {
        triggerToast({
          title: "Error",
          messages: ["Unable to fetch clubs", res.error.messages],
          severity: "error",
        });
        setClubs([]);
      }
    } catch (error) {
      triggerToast({
        title: "Error",
        messages: ["Unable to fetch clubs", error.message],
        severity: "error",
      });
      setClubs([]);
    } finally {
      setClubsLoading(false);
    }
  };

  // Fetch clubs on mount
  useEffect(() => {
    void fetchClubs();
  }, []);

  // When selected club changes fetch the members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await currentMembersAction({ cid: selectedClub });
      if (res.ok) {
        setFullMembers(res.data);
        const existing = res.data.map((member, index) => {
          const ongoing = member.roles?.filter((r) => r.endMy === null) || [];
          const latestRole = ongoing
            ?.slice()
            ?.sort((a, b) => {
              const [am, ay] = a.startMy || [1, 2000];
              const [bm, by] = b.startMy || [1, 2000];
              if (by !== ay) return by - ay;
              return bm - am;
            })[0];
          return {
            id: index,
            uid: member.uid,
            role: latestRole?.name || "",
            originalRole: latestRole?.name || "",
            startMy:
              latestRole?.startMy || [new Date().getMonth() + 1, new Date().getFullYear()],
            originalStartMy:
              latestRole?.startMy || [new Date().getMonth() + 1, new Date().getFullYear()],
            endMy: latestRole?.endMy ?? null,
            originalEndMy: latestRole?.endMy ?? null,
            isPoc: member.poc,
            isValid: true,
            error: null,
          };
        });
        setExistingMembers(existing);
        if (mode === "edit") {
          reset({ newMembers: existing });
        }
      } else {
        triggerToast({
          title: "Error",
          messages: res.error.messages,
          severity: "error",
        });
      }
    } catch (error) {
      triggerToast({
        title: "Error",
        messages: ["Failed to fetch members.", error.message],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClub) return;
    void fetchMembers();
  }, [selectedClub]);

  const handleClubChange = (event) => {
    setSelectedClub(event.target.value);
  };

  if (isMobile) {
    return (
      <ConfirmDialog
        open={isMobile}
        title="Mobile View"
        description="This form is not compatible with mobile devices. Please use a desktop or tablet to access this form."
        onConfirm={() => router.back()}
        confirmProps={{ color: "primary" }}
        confirmText="Go Back"
        addCancel={false}
      />
    );
  }

  async function submit(finalMembers, action, actionName) {
    // for each member called the createMemberAction and store the number of success and failures
    let successCount = 0;
    let failureCount = 0;
    let failureMessages = [];

    setLoading(true);
    for (const member of finalMembers) {
      const res = await action(member);
      if (res.ok) {
        successCount++;
      } else {
        failureCount++;
        failureMessages.push(
          `- Failed to ${actionName} ${member.uid}: ${res.error.messages.join(
            ", ",
          )}`,
        );
      }
    }

    // show toast with summary
    let toastMessages = [];
    if (successCount > 0) {
      toastMessages.push(
        `${successCount} out of ${finalMembers.length} member(s) ${actionName}ed successfully.`,
      );
    }
    if (failureCount > 0) {
      toastMessages.push(
        `${failureCount} out of ${finalMembers.length} member(s) failed to be ${actionName}ed.`,
      );
      toastMessages = toastMessages.concat(failureMessages);
    }
    setLoading(false);

    triggerToast({
      title:
        successCount > 0
          ? failureCount > 0
            ? "Partial Success"
            : "Success!"
          : "Failure",
      messages: toastMessages,
      severity:
        successCount > 0 ? (failureCount > 0 ? "warning" : "success") : "error",
    });

    router.push(`/manage/members`);
  }

  // transform data and mutate
  const submitHandlers = {
    add: (formData) => {
      setLoading(true);
      const newMembers = formData.newMembers;

      const finalMembers = newMembers
        .filter((member) => member.isValid)
        .map((member) => ({
          uid: member.uid,
          cid: selectedClub,
          roles: [
            {
              name: member.role,
              startMy: Array.isArray(member.startMy)
                ? [parseInt(member.startMy[0]), parseInt(member.startMy[1])]
                : parseMy(member.startMy),
              endMy:
                member.endMy === "-" || member.endMy === "" || member.endMy == null
                  ? null
                  : Array.isArray(member.endMy)
                    ? [parseInt(member.endMy[0]), parseInt(member.endMy[1])]
                    : parseMy(member.endMy),
            },
          ],
          poc: member.isPoc,
        }));
      void submit(finalMembers, createMemberAction, "add");
    },
    edit: (formData) => {
      setLoading(true);
      const updatedMembers = formData.newMembers;

      // use existing members, see the ones where the role names are different from fullMembers and construct the full roles
      const finalMembers = [];
      updatedMembers.forEach((member) => {
        const fullMember = fullMembers.find((m) => m.uid === member.uid);
        if (!fullMember) return;
        const latestRole = fullMember.roles
          ?.filter((role) => role.endMy === null)
          ?.sort((a, b) => {
            const [am, ay] = a.startMy || [1, 2000];
            const [bm, by] = b.startMy || [1, 2000];
            if (by !== ay) return by - ay;
            return bm - am;
          })[0];

        // check if role has changed
        if (
          member.role !== latestRole.name ||
          member.isPoc !== fullMember.poc ||
          !eqMy(member.startMy, latestRole.startMy) ||
          !eqMy(
            member.endMy === "-" || member.endMy === "" ? null : member.endMy,
            latestRole.endMy,
          )
        ) {
          // construct new roles with old roles and new roles appended, but make the lastRow's end year as currentYear
          const addNew = member.role !== latestRole.name;
          const newRoles = fullMember.roles.map((role) => {
            if (role.name === latestRole.name) {
              return {
                name: role.name,
                startMy: addNew
                  ? role.startMy
                  : Array.isArray(member.startMy)
                    ? [parseInt(member.startMy[0]), parseInt(member.startMy[1])]
                    : parseMy(member.startMy),
                endMy: addNew
                  ? parseMy(member.startMy)
                  : member.endMy === "-" || member.endMy === ""
                    ? null
                    : Array.isArray(member.endMy)
                      ? [
                          parseInt(member.endMy[0]),
                          parseInt(member.endMy[1]),
                        ]
                      : parseMy(member.endMy),
              };
            }
            return role;
          });

          // append the new role
          if (addNew) {
            newRoles.push({
              name: member.role,
              startMy: Array.isArray(member.startMy)
                ? [parseInt(member.startMy[0]), parseInt(member.startMy[1])]
                : parseMy(member.startMy),
              endMy:
                member.endMy === "-" || member.endMy === "" || member.endMy == null
                  ? null
                  : Array.isArray(member.endMy)
                    ? [parseInt(member.endMy[0]), parseInt(member.endMy[1])]
                    : parseMy(member.endMy),
            });
          }

          finalMembers.push({
            uid: member.uid,
            cid: selectedClub,
            roles: newRoles,
            poc: member.isPoc,
          });
        }
      });
      void submit(finalMembers, editMemberAction, "edit");
    },
  };

  return (
    <form onSubmit={handleSubmit(submitHandlers[mode])}>
      <Typography variant="h3" gutterBottom textTransform="capitalize">
        Bulk {mode} Members
      </Typography>

      {mode === "edit" && (
        <Typography variant="body2" gutterBottom>
          Only current members with latest roles will be shown here, for more
          detailed editing use the individual member edit page. For adding new
          members, please use the bulk add functionality.
        </Typography>
      )}
      {mode === "add" && (
        <Typography variant="body2" gutterBottom>
          This page is only to add new members not already present in the
          selected club/body. For editing existing members, please use the bulk
          edit functionality.
        </Typography>
      )}

      {!disableClubSelector && (
        <FormControl fullWidth sx={{ mb: 3, mt: 4 }}>
          <InputLabel id="cid-label">Club/Body *</InputLabel>
          <Select
            labelId="cid-label"
            id="cid"
            label="Club/Body *"
            disabled={clubsLoading}
            value={selectedClub}
            onChange={handleClubChange}
            variant="outlined"
            sx={{ width: "80%" }}
          >
            {clubsLoading ? (
              <MenuItem disabled>Loading clubs...</MenuItem>
            ) : (
              clubs
                ?.slice()
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((club) => (
                  <MenuItem key={club.cid} value={club.cid}>
                    {club.name}
                  </MenuItem>
                ))
            )}
          </Select>
        </FormControl>
      )}

      {mode === "add" && (
        <Typography
          variant="subtitle2"
          color="text.secondary"
          align="left"
          sx={{ mb: 2 }}
        >
          <u>NOTE</u>:<br />
          - Please ensure that the members being added do not already exist in
          the selected club/body.
          <br />- The default start date for all members will be set as {`${String(
            new Date().getMonth() + 1,
          ).padStart(2, "0")}-${new Date().getFullYear()}`}.
          <br />- Any invalid entries marked in red will be skipped during
          submission.
        </Typography>
      )}

      {mode === "edit" && (
        <Typography
          variant="subtitle2"
          color="text.secondary"
          align="left"
          mb={1}
        >
          <u>NOTE</u>: <br />
          - If you change the role to a new one, the current role&apos;s end
          date will be set to the new role&apos;s start date.
          <br />
          - Any invalid entries marked in red will be skipped during submission.
          <br />- Edited entries will be sent to the top.
        </Typography>
      )}

      <Controller
        name="newMembers"
        defaultValue={mode === "add" ? [] : existingMembers}
        control={control}
        render={({ field: { value, onChange } }) => (
          <MembersTable
            mode={mode}
            rows={value}
            setRows={onChange}
            setAllValid={setAllValid}
            existingMembers={existingMembers}
          />
        )}
      />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        mt={3}
      >
        <Button
          size="large"
          variant="outlined"
          color="primary"
          disabled={loading}
          fullWidth
          onClick={() => setCancelDialog(true)}
          sx={{ width: "25%" }}
        >
          Cancel
        </Button>
        <ConfirmDialog
          open={cancelDialog}
          title="Confirm cancellation"
          description="Are you sure you want to cancel? Any unsaved changes will be lost."
          onConfirm={() => router.back()}
          onClose={() => setCancelDialog(false)}
          confirmProps={{ color: "primary" }}
          confirmText="Yes, discard my changes"
        />
        <Button
          loading={loading}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          disabled={!allValid}
          sx={{ width: "25%" }}
        >
          Save
        </Button>
      </Stack>
      <ConfirmDialog
        open={expDialog}
        title="Experimental Features Ahead!"
        description="Bulk add/edit features are currently in experimental state, please check your member's roles and states properly after submission."
        onConfirm={() => router.back()}
        onClose={() => setExpDialog(false)}
        confirmProps={{ color: "primary" }}
        confirmText="Go Back"
        cancelText="Continue"
      />
    </form>
  );
}

function MembersTable({
  mode,
  rows = [],
  setRows = console.log,
  setAllValid,
  existingMembers = [],
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { triggerToast } = useToast();

  const minYear = 2010;
  const addMode = mode === "add";

  // position item template
  const emptyPositionItem = {
    uid: null,
    role: null,
    originalRole: null,
    startMy: [new Date().getMonth() + 1, new Date().getFullYear()],
    originalStartMy: [new Date().getMonth() + 1, new Date().getFullYear()],
    endMy: null,
    originalEndMy: null,
    isPoc: false,
    isValid: false,
    error: "Incomplete entry",
  };

  // data manipulation functions
  const onAdd = () => {
    const maxId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) : -1;
    const newId = maxId + 1;
    setRows([...rows, { id: newId, ...emptyPositionItem }]);
  };

  const onUpdate = async (row) => {
    if (!row.uid) return;
    row.isValid = true;
    if (addMode) {
      let res = await getUsers(row.uid);

      if (!res.ok) {
        row.isValid = false;
        row.error = "User not found";
      } else if (row.uid && existingMembers?.some((m) => m.uid === row.uid)) {
        row.isValid = false;
        row.error = "Member already exists in the club/body";
      } else if (row.uid && rows.filter((r) => r.uid === row.uid).length > 1) {
        row.isValid = false;
        row.error = "Duplicate member entry";
      }
    }

    row.startMy = parseMy(row.startMy);
    const now = [new Date().getMonth() + 1, new Date().getFullYear()];
    row.startMy = clampMy(row.startMy, [1, minYear], now);

    if (row.endMy === null || row.endMy === "" || row.endMy === "-") {
      row.endMy = null;
    } else {
      const endParsed = parseMy(row.endMy);
      const clampedEnd = clampMy(endParsed, row.startMy, now);
      row.endMy = gteMy(clampedEnd, row.startMy) ? clampedEnd : null;
    }

    // if role is bigger than 99 error out
    if (row.role === null || row.role.length === 0 || row.role.length >= 99) {
      row.isValid = false;
      row.error = "Role name should not be null and be less than 99 characters";
    }

    const newRows = rows.map((r) => {
      if (r.id === row.id) return row;
      return r;
    });
    setRows(newRows);

    // set all valid
    const allValid = newRows.every((r) => r.isValid);
    setAllValid(allValid);

    return row;
  };

  const onDelete = (row) => {
    const newRows = rows.filter((r) => r.id !== row.id);
    setRows(newRows);

    const allValid = newRows.every((r) => r.isValid);
    setAllValid(allValid);
  };

  useEffect(() => {
    if (!addMode) {
      return;
    }
    rows.forEach((row) => {
      void onUpdate(row);
    });
  }, [existingMembers]);

  const columns = [
    {
      // Hidden column to sort by edited rows
      field: "isEdited",
      headerName: "",
      hideable: false,
      filterable: false,
      sortable: true,
      valueGetter: (value, row) =>
        row.role !== row.originalRole ||
        !eqMy(row.startMy, row.originalStartMy) ||
        !eqMy(row.endMy, row.originalEndMy)
          ? "0" + row?.uid
          : "1" + row?.uid,
    },
    {
      field: "uid",
      headerName: "User Id (LDAP)",
      width: 250,
      flex: isMobile ? null : 4,
      editable: addMode,
      renderCell: (p) => {
        return p.value ? (
          <Typography
            variant="body2"
            color={
              addMode ||
              p.row.role !== p.row.originalRole ||
              !eqMy(p.row.startMy, p.row.originalStartMy) ||
              !eqMy(p.row.endMy, p.row.originalEndMy)
                ? "text.primary"
                : "text.secondary"
            }
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
            color="text.secondary"
            sx={{
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
      field: "role",
      headerName: "Role",
      width: 150,
      flex: isMobile ? null : 4,
      editable: true,
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
            color="text.secondary"
            sx={{
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
      editable: true,
      valueGetter: (value, row) =>
        row?.role === row?.originalRole
          ? fmtMy(row.startMy)
          : fmtMy([new Date().getMonth() + 1, new Date().getFullYear()]),
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            eqMy(p.row?.startMy, p.row?.originalStartMy) ||
            p.row?.role !== p.row?.originalRole
              ? "text.secondary"
              : "text.primary"
          }
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
          {p.value}
        </Typography>
      ),
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
          <Stack direction="row" spacing={1} sx={{ width: "100%", alignItems: "center" }}>
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
          </Stack>
        );
      },
      display: "flex",
    },
    {
      field: "endMy",
      headerName: "End (MM-YYYY)",
      valueGetter: (value, row) => (row.endMy ? fmtMy(row.endMy) : "-"),
      flex: isMobile ? null : 2,
      editable: true,
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            eqMy(p.row?.endMy, p.row?.originalEndMy)
              ? "text.secondary"
              : "text.primary"
          }
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
          {p.value}
        </Typography>
      ),
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
          <Stack direction="row" spacing={1} sx={{ width: "100%", alignItems: "center" }}>
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
          </Stack>
        );
      },
      display: "flex",
    },
    {
      field: "isPoc",
      type: "boolean",
      headerName: "is POC?",
      align: "center",
      editable: true,
      width: 75,
      renderCell: (p) => (
        <Icon
          external
          color={!!p.value ? "success.main" : "error.main"}
          variant={!!p.value ? "eva:checkmark-outline" : "eva:close-outline"}
        />
      ),
      display: "flex",
    },
    {
      field: "isValid",
      type: "boolean",
      headerName: "Valid?",
      align: "center",
      width: 100,
      renderCell: (p) => (
        <Tooltip title={p.row.error || ""} disableHoverListener={p.row.isValid}>
          <span>
            <Icon
              color={p.row.isValid ? "success.main" : "error.main"}
              variant={p.row.isValid ? "check-circle" : "cancel"}
              sx={{ height: 16, width: 16 }}
            />
          </span>
        </Tooltip>
      ),
      display: "flex",
      disableColumnMenu: true,
      sortable: false,
    },
    ...(addMode
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
            disableColumnMenu: true,
            sortable: false,
            disableExport: true,
          },
        ]
      : []),
  ];

  return (
    <>
      {addMode && (
        <Button size="small" variant="outlined" onClick={onAdd} sx={{ mb: 1 }}>
          <Icon variant="add" mr={1} />
          Add Item
        </Button>
      )}

      <DataGrid
        getRowHeight={() => "auto"}
        rows={rows}
        columns={columns}
        processRowUpdate={onUpdate}
        onProcessRowUpdateError={(error) =>
          triggerToast({
            ...error,
            severity: "error",
          })
        }
        disableRowSelectionOnClick
        sx={{
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
        sortingOrder={addMode ? undefined : ["desc", "asc"]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
          sorting: {
            sortModel: addMode ? [] : [{ field: "isEdited", sort: "asc" }],
          },
          columns: {
            columnVisibilityModel: {
              // Hide the 'isEdited' column, it's only for sorting
              isEdited: false,
              ...(addMode ? { startMy: false, endMy: false } : {}),
            },
          },
        }}
      />
    </>
  );
}

// Helpers for [month, year] arrays
function parseMy(v) {
  if (v == null || v === "")
    return [new Date().getMonth() + 1, new Date().getFullYear()];
  if (Array.isArray(v) && v.length === 2)
    return [parseInt(v[0]), parseInt(v[1])];
  if (typeof v === "string") {
    const s = v.trim();
    const parts = s.includes("-") ? s.split("-") : s.split("/");
    if (parts.length === 2) {
      const mm = parseInt(parts[0]);
      const yy = parseInt(parts[1]);
      if (!isNaN(mm) && !isNaN(yy)) return [mm, yy];
    }
  }
  return [new Date().getMonth() + 1, new Date().getFullYear()];
}

function fmtMy(my) {
  if (!Array.isArray(my) || my.length !== 2) return "";
  return `${String(my[0]).padStart(2, "0")}-${my[1]}`;
}

function clampMy([m, y], [minM, minY], [maxM, maxY]) {
  if (y < minY) return [minM, minY];
  if (y > maxY) return [maxM, maxY];
  let mm = Math.min(12, Math.max(1, parseInt(m)));
  if (y === minY && mm < minM) mm = minM;
  if (y === maxY && mm > maxM) mm = maxM;
  return [mm, y];
}

function gteMy(a, b) {
  if (a == null || b == null) return false;
  if (a[1] !== b[1]) return a[1] > b[1];
  return a[0] >= b[0];
}

function eqMy(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a == null && b == null;
  return Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1];
}
