"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Switch,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  FormGroup,
  FormControlLabel,
  InputLabel,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

import Icon from "components/Icon";
import UserImage from "components/users/UserImage";
import ConfirmDialog from "components/ConfirmDialog";

import MemberPositions from "components/members/MemberPositions";

import { getActiveClubIds } from "actions/clubs/ids/server_action";
import { getUsers } from "actions/users/get/server_action";
import { createMemberAction } from "actions/members/create/server_action";
import { editMemberAction } from "actions/members/edit/server_action";

export default function MemberForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();
  const { user } = useAuth();

  const [userMember, setUserMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [positionEditing, setPositionEditing] = useState(false);

  const { control, watch, setValue, handleSubmit } = useForm({ defaultValues });
  const { triggerToast } = useToast();

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
    create: async (data) => {
      let res = await createMemberAction(data);

      if (res.ok) {
        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Member added."],
          severity: "success",
        });
        router.push(`/manage/members?club=${data.cid}`);
        router.refresh();
      } else {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });
        setLoading(false);
      }
    },
    edit: async (data) => {
      let res = await editMemberAction(data);

      if (res.ok) {
        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Member edited."],
          severity: "success",
        });
        router.push(`/manage/members?club=${data.cid}`);
        router.refresh();
      } else {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });
        setLoading(false);
      }
    },
  };

  // transform data and mutate
  async function onSubmit(formData) {
    setLoading(true);

    const data = {
      cid: formData.cid,
      uid: formData.uid,
      poc: formData.poc,
    };

    // set club ID for member based on user role
    if (user?.role === "club") {
      data.cid = user?.uid;
    } else if (user?.role === "cc") {
      data.cid = formData.cid;
    }

    // show error toast if uid is empty
    if (!data.uid) {
      setLoading(false);
      return triggerToast({
        title: "Error!",
        messages: [
          "User has not been confirmed! Enter a valid email and click the 👍 button to confirm.",
        ],
        severity: "error",
      });
    }

    // convert roles to array of objects with only required attributes
    // remove roles items without a name (they're invalid)
    data.roles = formData.roles
      .filter((i) => i?.name)
      .map((i) => ({
        name: i.name,
        startYear: parseInt(i.startYear),
        endYear: i.endYear === "-" ? null : parseInt(i.endYear),
      }));

    // mutate
    await submitHandlers[action](data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid container item xs={12} md={7} xl={8} spacing={3}>
          <Grid container item>
            <Grid container item spacing={2}>
              {user?.role === "cc" ? (
                <Grid item xs={12}>
                  <MemberClubSelect
                    control={control}
                    watch={watch}
                    edit={action === "edit"}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Grid>

          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mb={2}
            >
              User
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <MemberUserInput
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  user={userMember}
                  setUser={setUserMember}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mb={2}
            >
              Positions
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <MemberPositionsTable
                  control={control}
                  watch={watch}
                  positionEditing={positionEditing}
                  setPositionEditing={setPositionEditing}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item xs md spacing={3} alignItems="flex-start">
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
            >
              Other
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <MemberPOCSwitch control={control} watch={watch} />
              </Grid>
            </Grid>

            <Grid container item direction="row" xs={12} spacing={1} pt={3}>
              <Grid item xs={6}>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  onClick={() => setCancelDialog(true)}
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
              </Grid>
              <Grid item xs={6}>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={positionEditing || !userMember}
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

// find user by email
function MemberUserInput({ control, watch, setValue, user, setUser }) {
  const { triggerToast } = useToast();

  const uid = watch("uid");
  const emailInput = watch("userSelector");
  useEffect(() => {
    (async () => {
      if (uid) await getUser();
    })();
  }, [uid]);

  const getUser = async () => {
    let res = await getUsers(uid);

    if (res.ok) {
      // set current user
      setUser(res.data);
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return user ? (
    <Stack direction="row" alignItems="center" spacing={4}>
      <UserImage
        image={user.img}
        name={user.firstName}
        gender={user.gender}
        width={80}
        height={80}
      />
      <Stack direction="column" spacing={1}>
        <Typography variant="h4" sx={{ wordBreak: "break-word" }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          fontFamily="monospace"
        >
          {user.email}
        </Typography>
      </Stack>
    </Stack>
  ) : (
    <Controller
      name="userSelector"
      control={control}
      render={({ field }) => (
        <Stack direction="row" spacing={1}>
          <TextField
            {...field}
            type="email"
            label="Email"
            autoComplete="off"
            variant="outlined"
            helperText={
              "Click the 👍 button to confirm the user and verify their email"
            }
            fullWidth
            required
          />
          <Button
            color="primary"
            variant="contained"
            onClick={() => setValue("uid", emailInput.split("@")[0])}
          >
            <Icon variant="thumb-up-outline-rounded" />
          </Button>
        </Stack>
      )}
    />
  );
}

// select club to which member belongs to
function MemberClubSelect({ control, edit }) {
  const { triggerToast } = useToast();

  // fetch list of clubs
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await getActiveClubIds();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setClubs(res.data);
      }
    })();
  }, []);

  return (
    <Controller
      name="cid"
      control={control}
      rules={{ required: "Select a club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="cid">Club *</InputLabel>
          <Select
            labelId="cid"
            label="Club/Body *"
            fullWidth
            disabled={edit}
            {...field}
          >
            {clubs
              ?.slice()
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((club) => (
                <MenuItem key={club.cid} value={club.cid}>
                  {club.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

// input event budget as a table
function MemberPositionsTable({
  control,
  watch,
  positionEditing,
  setPositionEditing,
}) {
  // TODO: watch for uid & cid change, populate table with existing data
  // [AFTER create and edit member mutations have been merged into one]

  return (
    <Controller
      name="roles"
      control={control}
      render={({ field: { value, onChange } }) => (
        <MemberPositions
          editable
          rows={value}
          setRows={onChange}
          positionEditing={positionEditing}
          setPositionEditing={setPositionEditing}
        />
      )}
    />
  );
}

// switch for member POC status
function MemberPOCSwitch({ control, watch }) {
  // TODO: watch for uid & cid change, populate table with existing data
  // [AFTER create and edit member mutations have been merged into one]

  return (
    <Controller
      name="poc"
      control={control}
      render={({ field }) => (
        <FormGroup row>
          <FormControlLabel
            value="left"
            control={
              <Switch color="primary" checked={field.value} {...field} />
            }
            label="Point of Contact"
            labelPlacement="left"
          />
        </FormGroup>
      )}
    />
  );
}
