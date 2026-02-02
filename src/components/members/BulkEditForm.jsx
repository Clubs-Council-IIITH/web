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
import { fmtMonthYear } from "utils/membersDates";

import { getActiveClubIds } from "actions/clubs/ids/server_action";
import { createMemberAction } from "actions/members/create/server_action";
import { currentMembersAction } from "actions/members/current/server_action";
import { editMemberAction } from "actions/members/edit/server_action";
import { getUsers } from "actions/users/get/server_action";

const [currentYear, currentMonth] = [
  new Date().getFullYear(),
  new Date().getMonth() + 1,
];

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
  const [monthDialog, setMonthDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);

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
          const latestRole = member.roles
            ?.filter((role) => role.endYear === null)
            ?.sort((a, b) => b.startYear - a.startYear)[0];
          return {
            id: index,
            uid: member.uid,
            role: latestRole?.name || "",
            originalRole: latestRole?.name || "",
            startYear: latestRole?.startYear || currentYear,
            originalStartYear: latestRole?.startYear || currentYear,
            startMonth: latestRole?.startMonth || null,
            originalStartMonth: latestRole?.startMonth || null,
            endYear: latestRole?.endYear,
            originalEndYear: latestRole?.endYear,
            endMonth: latestRole?.endMonth || null,
            originalEndMonth: latestRole?.endMonth || null,
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
      const hasMissingMonths = newMembers.some(
        (m) =>
          m.isValid &&
          (m.startMonth == null ||
            (m.endYear !== null &&
              m.endYear !== "" &&
              m.endYear !== "-" &&
              m.endMonth == null)),
      );
      if (hasMissingMonths) {
        setLoading(false);
        setPendingFormData(formData);
        setPendingMode("add");
        setMonthDialog(true);
        return;
      }

      const finalMembers = newMembers
        .filter((member) => member.isValid)
        .map((member) => ({
          uid: member.uid,
          cid: selectedClub,
          roles: [
            {
              name: member.role,
              startYear: parseInt(member.startYear),
              startMonth:
                member.startMonth == null ? null : parseInt(member.startMonth),
              endYear: member.endYear === "-" ? null : parseInt(member.endYear),
              endMonth:
                member.endYear === "-" ||
                member.endYear === null ||
                member.endYear === ""
                  ? null
                  : member.endMonth == null || member.endMonth === "-"
                    ? null
                    : parseInt(member.endMonth),
            },
          ],
          poc: member.isPoc,
        }));
      void submit(finalMembers, createMemberAction, "add");
    },
    edit: (formData) => {
      setLoading(true);
      const updatedMembers = formData.newMembers;

      const hasMissingMonths = updatedMembers.some(
        (m) =>
          m.startMonth == null ||
          (m.endYear !== null &&
            m.endYear !== "" &&
            m.endYear !== "-" &&
            m.endMonth == null),
      );
      if (hasMissingMonths) {
        setLoading(false);
        setPendingFormData(formData);
        setPendingMode("edit");
        setMonthDialog(true);
        return;
      }

      // use existing members, see the ones where the role names are different from fullMembers and construct the full roles
      const finalMembers = [];
      updatedMembers.forEach((member) => {
        const fullMember = fullMembers.find((m) => m.uid === member.uid);
        if (!fullMember) return;
        const latestRole = fullMember.roles
          ?.filter((role) => role.endYear === null)
          ?.sort((a, b) => b.startYear - a.startYear)[0];

        // check if role has changed
        if (
          member.role !== latestRole.name ||
          member.isPoc !== fullMember.poc ||
          member.startYear !== latestRole.startYear ||
          member.startMonth !== (latestRole.startMonth ?? null) ||
          (member.endYear === "-" ? null : member.endYear) !==
            latestRole.endYear ||
          (member.endMonth === "-" ? null : member.endMonth) !==
            (latestRole.endMonth ?? null)
        ) {
          // construct new roles with old roles and new roles appended, but make the lastRow's end year as currentYear
          const addNew = member.role !== latestRole.name;
          const newRoles = fullMember.roles.map((role) => {
            if (role.name === latestRole.name) {
              return {
                name: role.name,
                startYear: addNew ? role.startYear : member.startYear,
                startMonth: addNew
                  ? role.startMonth
                  : member.startMonth == null
                    ? null
                    : parseInt(member.startMonth),
                endYear: addNew
                  ? parseInt(member.startYear)
                  : member.endYear === "-"
                    ? null
                    : parseInt(member.endYear),
                endMonth: addNew
                  ? member.startMonth == null
                    ? null
                    : parseInt(member.startMonth)
                  : member.endYear === "-" ||
                      member.endYear === null ||
                      member.endYear === ""
                    ? null
                    : member.endMonth == null || member.endMonth === "-"
                      ? member.startMonth == null
                        ? null
                        : parseInt(member.startMonth)
                      : parseInt(member.endMonth),
              };
            }
            return role;
          });

          // append the new role
          if (addNew) {
            newRoles.push({
              name: member.role,
              startYear: parseInt(member.startYear),
              startMonth:
                member.startMonth == null ? null : parseInt(member.startMonth),
              endYear: member.endYear === "-" ? null : parseInt(member.endYear),
              endMonth:
                member.endYear === "-" ||
                member.endYear === null ||
                member.endYear === ""
                  ? null
                  : member.endMonth == null || member.endMonth === "-"
                    ? member.startMonth == null
                      ? null
                      : parseInt(member.startMonth)
                    : parseInt(member.endMonth),
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
          <br />- The default start year for all members will be set as{" "}
          {currentYear}
          {"-"}
          {currentMonth}.
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
          year will be set to the new role&apos;s start year.
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
      <ConfirmDialog
        open={monthDialog}
        title={"Missing Month(s)"}
        description={
          "Start month and/or end month has not been initialized for one or more entries. If you proceed, missing months will be set to 1 (January) where required. Would you like to proceed or edit the month(s)?"
        }
        onConfirm={async () => {
          setMonthDialog(false);
          if (!pendingFormData) return;
          setLoading(true);
          if (pendingMode === "add") {
            const newMembers = pendingFormData.newMembers;
            const finalMembers = newMembers
              .filter((member) => member.isValid)
              .map((member) => ({
                uid: member.uid,
                cid: selectedClub,
                roles: [
                  {
                    name: member.role,
                    startYear: parseInt(member.startYear),
                    startMonth: 1,
                    endYear:
                      member.endYear === "-" ? null : parseInt(member.endYear),
                    endMonth:
                      member.endYear === "-" ||
                      member.endYear === null ||
                      member.endYear === ""
                        ? null
                        : 1,
                  },
                ],
                poc: member.isPoc,
              }));
            await submit(finalMembers, createMemberAction, "add");
          } else if (pendingMode === "edit") {
            const updatedMembers = pendingFormData.newMembers;
            const finalMembers = [];
            updatedMembers.forEach((member) => {
              const fullMember = fullMembers.find((m) => m.uid === member.uid);
              if (!fullMember) return;
              const latestRole = fullMember.roles
                ?.filter((role) => role.endYear === null)
                ?.sort((a, b) => b.startYear - a.startYear)[0];

              // Planned values: set missing months to 1 when proceeding
              const plannedStartMonth =
                member.startMonth == null ? 1 : parseInt(member.startMonth, 10);
              const plannedEndYear =
                member.endYear === "-"
                  ? null
                  : member.endYear == null || member.endYear === ""
                    ? null
                    : parseInt(member.endYear, 10);
              const plannedEndMonth =
                plannedEndYear == null
                  ? null
                  : member.endMonth == null || member.endMonth === "-"
                    ? 1
                    : parseInt(member.endMonth, 10);

              const missingStartMonth = latestRole?.startMonth == null;
              const missingEndMonth =
                plannedEndYear != null &&
                (latestRole?.endMonth == null ||
                  member.endMonth == null ||
                  member.endMonth === "-");

              const dataChanged =
                member.role !== latestRole.name ||
                member.isPoc !== fullMember.poc ||
                member.startYear !== latestRole.startYear ||
                plannedEndYear !== latestRole.endYear ||
                missingStartMonth ||
                missingEndMonth;

              if (dataChanged) {
                const addNew = member.role !== latestRole.name;
                const newRoles = fullMember.roles.map((role) => {
                  if (role.name === latestRole.name) {
                    return {
                      name: role.name,
                      startYear: addNew ? role.startYear : member.startYear,
                      startMonth: addNew ? role.startMonth : plannedStartMonth,
                      endYear: addNew
                        ? parseInt(member.startYear, 10)
                        : plannedEndYear,
                      endMonth: addNew ? plannedStartMonth : plannedEndMonth,
                    };
                  }
                  return role;
                });

                if (addNew) {
                  newRoles.push({
                    name: member.role,
                    startYear: parseInt(member.startYear, 10),
                    startMonth: plannedStartMonth,
                    endYear: plannedEndYear,
                    endMonth: plannedEndMonth,
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
            await submit(finalMembers, editMemberAction, "edit");
          }
        }}
        onClose={() => setMonthDialog(false)}
        confirmProps={{ color: "primary" }}
        confirmText={"Proceed"}
        cancelText={"Edit Months"}
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
    startYear: currentYear,
    originalStartYear: currentYear,
    startMonth: currentMonth,
    originalStartMonth: currentMonth,
    endYear: null,
    originalEndYear: null,
    endMonth: null,
    originalEndMonth: null,
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

    // clamp years and months
    row.startYear = Math.min(Math.max(row.startYear, minYear), currentYear);
    if (row.endYear)
      row.endYear =
        row.endYear > currentYear ? "" : Math.max(row.endYear, row.startYear);

    // if role is bigger than 99 error out
    if (row.role === null || row.role.length === 0 || row.role.length >= 99) {
      row.isValid = false;
      row.error = "Role name should not be null and be less than 99 characters";
    }

    // make sure row.endYear and row.endMonth are not before startYear and startMonth
    if (
      row.endYear &&
      row.endYear === row.startYear &&
      row.endMonth &&
      row.startMonth &&
      row.endMonth < row.startMonth
    ) {
      row.endMonth = row.startMonth;
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
        row.startYear !== row.originalStartYear ||
        row.startMonth !== row.originalStartMonth ||
        row.endYear !== row.originalEndYear ||
        row.endMonth !== row.originalEndMonth
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
              p.row.startYear !== p.row.originalStartYear ||
              p.row.endYear !== p.row.originalEndYear
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
      field: "start",
      headerName: "Start (YYYY-MM)",
      flex: isMobile ? null : 3,
      editable: true,
      valueGetter: (value, row) =>
        fmtMonthYear(row.startMonth, row.startYear) ?? "",
      valueSetter: (value, row) => {
        if (!value) return row;
        const [y, m] = value.split("-");
        const y_num = parseInt(y, 10);
        const m_num = Math.min(12, Math.max(1, parseInt(m, 10)));
        if (isNaN(y_num) || isNaN(m_num)) {
          return row;
        }
        return { ...row, startYear: y_num, startMonth: m_num };
      },
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            p.row?.startMonth === p.row?.originalStartMonth &&
            p.row?.startYear === p.row?.originalStartYear
              ? "text.secondary"
              : "text.primary"
          }
          sx={{
            display: "flex",
            alignItems: "center",
            px: "5px",
            py: "10px",
            justifyContent: "center",
          }}
        >
          {fmtMonthYear(p.row.startMonth, p.row.startYear) ?? ""}
        </Typography>
      ),
      renderEditCell: (params) => {
        const { row, api, id, field } = params;
        const defaultValue =
          fmtMonthYear(row?.startMonth, row?.startYear, true) ?? "";
        return (
          <input
            type="month"
            defaultValue={defaultValue}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: id,
                field: field,
                value: e.target.value,
              })
            }
            required
            min={`2010-01`}
            max={
              currentMonth === 12
                ? `${currentYear + 1}-01`
                : `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
            }
            onBlur={() => {
              api.stopCellEditMode({ id, field });
            }}
            style={{
              width: "100%",
              padding: 6,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        );
      },
      display: "flex",
    },
    {
      field: "end",
      headerName: "End (YYYY-MM)",
      flex: isMobile ? null : 3,
      editable: true,
      valueGetter: (value, row) =>
        fmtMonthYear(row.endMonth, row.endYear) ?? "",
      valueSetter: (value, row) => {
        if (!value) return { ...row, endYear: null, endMonth: null };
        const [y, m] = value.split("-");
        const y_num = parseInt(y, 10);
        const m_num = Math.min(12, Math.max(1, parseInt(m, 10)));
        if (isNaN(y_num) || isNaN(m_num)) {
          return { ...row, endYear: null, endMonth: null };
        }
        return { ...row, endYear: y_num, endMonth: m_num };
      },
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            p.row?.endMonth === p.row?.originalEndMonth &&
            p.row?.endYear === p.row?.originalEndYear
              ? "text.secondary"
              : "text.primary"
          }
          sx={{
            display: "flex",
            alignItems: "center",
            px: "5px",
            py: "10px",
            justifyContent: "center",
          }}
        >
          {fmtMonthYear(p.row.endMonth, p.row.endYear) ?? ""}
        </Typography>
      ),
      renderEditCell: (params) => (
        <input
          type="month"
          defaultValue={
            fmtMonthYear(params.row.endMonth, params.row.endYear, true) ?? ""
          }
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          min={`2010-01`}
          max={
            currentMonth === 12
              ? `${currentYear + 1}-01`
              : `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
          }
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      ),
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
        experimentalFeatures={{ newEditingApi: true }}
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
              isEdited: false, // Hide the year columns in add mode
              ...(addMode ? { start: false, end: false } : {}),
            },
          },
        }}
      />
    </>
  );
}
