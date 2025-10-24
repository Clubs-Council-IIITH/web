"use client";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";

import {
  Button,
  Typography,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";
import ConfirmDialog from "components/ConfirmDialog";

import { getUsers } from "actions/users/get/server_action";
import { createMemberAction } from "actions/members/create/server_action";
import { getActiveClubIds } from "actions/clubs/ids/server_action";

import { DataGrid } from "@mui/x-data-grid";
import { currentMembersAction } from "actions/members/current/server_action";
import { editMemberAction } from "actions/members/edit/server_action";

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
        messages: ["Unable to fetch clubs",error.message],
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
            startYear: latestRole?.startYear || new Date().getFullYear(),
            endYear: latestRole?.endYear,
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
          `- Failed to ${actionName} ${member.uid}: ${res.error.messages.join(", ")}`,
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
    router.refresh();
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
              startYear: parseInt(member.startYear),
              endYear: member.endYear === "-" ? null : parseInt(member.endYear),
            },
          ],
          poc: member.isPoc,
        }));
      submit(finalMembers, createMemberAction, "add");
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
          ?.filter((role) => role.endYear === null)
          ?.sort((a, b) => b.startYear - a.startYear)[0];

        // check if role has changed
        if (
          member.role !== latestRole.name ||
          member.isPoc !== fullMember.poc ||
          member.startYear !== latestRole.startYear ||
          (member.endYear === "-" ? null : member.endYear) !==
            latestRole.endYear
        ) {
          // construct new roles with old roles and new roles appended, but make the lastRow's end year as currentYear
          const addNew = member.role !== latestRole.name;
          const newRoles = fullMember.roles.map((role) => {
            if (role.name === latestRole.name) {
              return {
                name: role.name,
                startYear: addNew ? role.startYear : member.startYear,
                endYear: addNew ? parseInt(member.startYear) : member.endYear,
              };
            }
            return role;
          });

          // append the new role
          if (addNew) {
            newRoles.push({
              name: member.role,
              startYear: parseInt(member.startYear),
              endYear: member.endYear === "-" ? null : parseInt(member.endYear),
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
      submit(finalMembers, editMemberAction, "edit");
    },
  };

  return (
    <form onSubmit={handleSubmit(submitHandlers[mode])}>
      <Typography variant="h3" gutterBottom textTransform={"capitalize"}>
        Bulk {mode} Members
      </Typography>
      {mode === "edit" && (
        <Typography variant="body2" gutterBottom>
          Only current members with latest roles will be shown here, for more
          detailed editing use the individual member edit page.
        </Typography>
      )}
      <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
        <InputLabel id="cid-label">Club/Body *</InputLabel>
        <Select
          labelId="cid-label"
          id="cid"
          label="Club/Body *"
          disabled={disableClubSelector || clubsLoading}
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
      {mode === "edit" && (
        <Typography variant="subtitle2"  color="text.secondary" align="right">
          NOTE: If you
          change the role to a new one, the current role's end year will be set
          to the new role's start year.
        </Typography>
      )}
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
        <LoadingButton
          loading={loading}
          type="submit"
          size="large"
          variant="contained"
          color="primary"
          disabled={!allValid}
          sx={{ width: "25%" }}
        >
          Save
        </LoadingButton>
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
  const editable = mode === "add";

  // position item template
  const emptyPositionItem = {
    uid: null,
    role: null,
    originalRole: null,
    startYear: new Date().getFullYear(),
    endYear: null,
    isPoc: false,
    isValid: false,
    error: "Incomplete entry",
  };

  useEffect(() => {
    const revalidated = rows.map((row) => {
      const newRow = { ...row };

      if (editable && newRow.uid && existingMembers?.some((m) => m.uid === newRow.uid)) {
        newRow.isValid = false;
        newRow.error = "Member already exists in the club/body";
      } else {
        newRow.isValid = true;
        newRow.error = null;
      }

      return newRow;
    });

    setRows(revalidated);
    setAllValid(revalidated.every((r) => r.isValid));
  }, [existingMembers]);

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };

  const onUpdate = async (row) => {
    if (editable) {
      let res = await getUsers(row.uid); // Add await here

      if (!res.ok) {
        row.isValid = false;
        row.error = "User not found";
        return row;
      }

      // if member already exists error out
      if (row.uid && existingMembers?.some((m) => m.uid === row.uid)) {
        row.isValid = false;
        row.error = "Member already exists in the club/body";
        return row;
      }
    }

    row.startYear =
      parseInt(row.startYear) > minYear ? parseInt(row.startYear) : minYear;
    row.startYear =
      row.startYear > new Date().getFullYear()
        ? new Date().getFullYear()
        : row.startYear;
    if (row.startYear > new Date().getFullYear()) {
      row.isValid = false;
      row.error = "Start year cannot be in the future";
      return row;
    }

    const rawEnd = row.endYear;
    if (rawEnd === null || rawEnd === "" || rawEnd === "-") {
      row.endYear = rawEnd;
    } else {
      const parsed = Number.parseInt(rawEnd, 10);
      const clamped = isNaN(parsed) ? minYear : Math.max(parsed, minYear);
      row.endYear =
        clamped > new Date().getFullYear()
          ? ""
          : Math.max(clamped, row.startYear);
    }

    // if role is bigger than 99 error out
    if (row.role === null || row.role.length === 0 || row.role.length >= 99) {
      row.isValid = false;
      row.error = "Role name should not be null and be less than 99 characters";
      return row;
    }

    row.isValid = true;

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
    setRows(rows.filter((r) => r.id !== row.id));
  };

  const columns = [
    {
      field: "isEdited",
      headerName: "",
      width: 0,
      hideable: false,
      filterable: false,
      sortable: true,
      valueGetter: (value, row) => (row.role !== row.originalRole ? 1 : 0),
      renderCell: () => null,
    },
    {
      field: "uid",
      headerName: "User Id (LDAP)",
      width: 250,
      flex: isMobile ? null : 4,
      editable: editable,
      renderCell: (p) => {
        return p.value ? (
          <Typography
            variant="body2"
            color={editable ? "text.primary" : "text.secondary"}
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
      field: "startYear",
      headerName: "Start Year",
      flex: isMobile ? null : 2,
      editable: true,
      valueGetter: (value, row) => row?.role === row?.originalRole ? row.startYear : new Date().getFullYear(),
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            p.row?.role === p.row?.originalRole
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
      display: "flex",
    },
    {
      field: "endYear",
      headerName: "End Year",
      valueGetter: (value, row) => row.endYear || "-",
      flex: isMobile ? null : 2,
      editable: true,
      renderCell: (p) => (
        <Typography
          variant="body2"
          color={
            p.row?.role === p.row?.originalRole
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
    },
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
      : []),
  ];

  return (
    <>
      {editable && (
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
        sortingOrder={["desc", , "asc"]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: "isEdited", sort: "desc" }],
          },
          columns: {
            columnVisibilityModel: {
              // Hide the 'isEdited' column, it's only for sorting
              isEdited: false,
            },
          },
        }}
      />
    </>
  );
}
