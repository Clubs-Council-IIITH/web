"use client";

import dayjs, { isDayjs } from "dayjs";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useForm, Controller, useController } from "react-hook-form";

import { useToast } from "components/Toast";

import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import {
  Box,
  Button,
  Chip,
  Grid,
  Fade,
  CircularProgress,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

import FileUpload from "components/FileUpload";
import EventBudget from "components/events/EventBudget";
import ConfirmDialog from "components/ConfirmDialog";
import MemberListItem from "components/members/MemberListItem";

import { uploadFile } from "utils/files";
import { audienceMap } from "constants/events";
import { getDuration, getDateStr } from "utils/formatTime";
import { locationLabel } from "utils/formatEvent";
import { useAuth } from "components/AuthProvider";

const allowed_roles = ["cc", "slo"];

export default function EventForm({
  id = null,
  defaultValues = {},
  action = "log",
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [budgetEditing, setBudgetEditing] = useState(false);
  const [hasPhone, setHasPhone] = useState(true);

  const { control, handleSubmit, watch, resetField } = useForm({
    defaultValues,
  });
  const { triggerToast } = useToast();

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
    create: async (data, opts) => {
      let res = await fetch("/actions/events/create", {
        method: "POST",
        body: JSON.stringify({ details: data }),
      });
      res = await res.json();

      if (res.ok) {
        // also submit event if requested
        if (opts?.shouldSubmit) {
          let submit_res = await fetch("/actions/events/progress", {
            method: "POST",
            body: JSON.stringify({ eventid: res.data._id }),
          });
          submit_res = await submit_res.json();

          if (submit_res.ok) {
            triggerToast({
              title: "Success!",
              messages: ["Event created and submitted for approval."],
              severity: "success",
            });
            router.push("/manage/events");
            router.refresh();
          } else {
            // show error toast
            triggerToast({
              ...submit_res.error,
              severity: "error",
            });
            setLoading(false);
          }

          return;
        }

        // else show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages:
            user?.role === "cc"
              ? ["Event created."]
              : ["Event created & saved as draft."],
          severity: "success",
        });
        router.push(`/manage/events/${res.data._id}`);
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
    edit: async (data, opts) => {
      let res = await fetch("/actions/events/edit", {
        method: "POST",
        body: JSON.stringify({ details: data, eventid: id }),
      });
      res = await res.json();

      if (res.ok) {
        // also submit event if requested
        if (opts?.shouldSubmit) {
          let submit_res = await fetch("/actions/events/progress", {
            method: "POST",
            body: JSON.stringify({ eventid: res.data._id }),
          });
          submit_res = await submit_res.json();

          if (submit_res.ok) {
            triggerToast({
              title: "Success!",
              messages: ["Event edited and submitted for approval."],
              severity: "success",
            });
            router.push("/manage/events");
            router.refresh();
          } else {
            // show error toast
            triggerToast({
              ...submit_res.error,
              severity: "error",
            });
            setLoading(false);
          }

          return;
        }

        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Event edited."],
          severity: "success",
        });
        router.push(`/manage/events/${res.data._id}`);
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
    phone: async (data) => {
      let res = await fetch("/actions/users/save/phone", {
        method: "POST",
        body: JSON.stringify({ userDataInput: data }),
      });
      res = await res.json();

      if (!res.ok) {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });

        return false;
      }

      return true;
    },
  };

  async function onSubmit(formData, opts) {
    setLoading(true);

    const data = {
      name: formData.name,
      description: formData.description,
      audience: formData.audience,
      mode: formData.mode,
      link: formData.link,
      location: formData.location,
      population: parseInt(formData.population),
      additional: formData.additional,
      equipment: formData.equipment,
      poc: formData.poc,
    };

    // set club ID for event based on user role
    if (user?.role === "club") {
      data.clubid = user?.uid;
    } else if (allowed_roles.includes(user?.role)) {
      data.clubid = formData.clubid;
    }

    // upload poster
    data.poster =
      typeof formData.poster === "string"
        ? formData.poster
        : Array.isArray(formData.poster) && formData.poster.length > 0
          ? await uploadFile(formData.poster[0], "image")
          : null;

    // convert dates to ISO strings
    data.startTime = getDateStr(formData.startTime)
    data.endTime = getDateStr(formData.endTime)

    // get duration from startTime and endTime
    data.duration = getDuration(formData.startTime, formData.endTime)

    // convert budget to array of objects with only required attributes
    // remove budget items without a description (they're invalid)
    data.budget = formData.budget
      .filter((i) => i?.description)
      .filter((i) => i?.amount > 0)
      .map((i) => ({
        description: i.description,
        amount: i.amount,
        advance: i.advance,
      }));

    // TODO: fix event link field
    data.link = null;

    // set POC phone number
    if (!hasPhone && formData.poc_phone) {
      const phoneData = {
        uid: formData.poc,
        phone: formData.poc_phone,
      };
      let phoneReturn = submitHandlers["phone"](phoneData);
      if (!phoneReturn) {
        setLoading(false);
        return;
      }
    }

    // mutate
    submitHandlers[action](data, opts);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid container item xs={12} md={7} xl={8} spacing={3}>
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mb={2}
            >
              Details
            </Typography>
            <Grid container item spacing={2}>
              {allowed_roles.includes(user?.role) ? (
                <Grid item xs={12}>
                  <EventClubSelect
                    control={control}
                    disabled={
                      user?.role != "cc" &&
                      defaultValues?.status?.state != undefined &&
                      defaultValues?.status?.state != "incomplete"
                    }
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <EventNameInput
                  control={control}
                  disabled={
                    !allowed_roles.includes(user?.role) &&
                    defaultValues?.status?.state != undefined &&
                    defaultValues?.status?.state != "incomplete"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <EventDatetimeInput
                  control={control}
                  watch={watch}
                  disabled={
                    !allowed_roles.includes(user?.role) &&
                    defaultValues?.status?.state != undefined &&
                    defaultValues?.status?.state != "incomplete"
                  }
                  role={user?.role}
                />
              </Grid>
              <Grid item xs={12}>
                <EventAudienceSelect control={control} />
              </Grid>
              <Grid item xs={12}>
                <EventDescriptionInput control={control} />
              </Grid>
              {user?.role === "club" ? (
                <Grid item xs={12}>
                  <EventPOC
                    control={control}
                    watch={watch}
                    cid={user?.uid}
                    hasPhone={hasPhone}
                    setHasPhone={setHasPhone}
                    disabled={
                      defaultValues?.status?.state == "approved" &&
                      defaultValues?.startTime &&
                      new Date(defaultValues?.startTime) < new Date()
                    }
                  />
                </Grid>
              ) : user?.role === "cc" ? (
                <Grid item xs={12}>
                  <EventPOC
                    control={control}
                    watch={watch}
                    cid={watch("clubid")}
                    hasPhone={hasPhone}
                    setHasPhone={setHasPhone}
                  />
                </Grid>
              ) : null}
              {/*
              <Grid item xs={12}>
                <EventLinkInput control={control} />
              </Grid>
              */}
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
              Budget
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <EventBudgetTable
                  control={control}
                  watch={watch}
                  disabled={
                    !allowed_roles.includes(user?.role) &&
                    defaultValues?.status?.state != undefined &&
                    defaultValues?.status?.state != "incomplete"
                  }
                  setBudgetEditing={setBudgetEditing}
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
              Venue
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <EventVenueInput
                  control={control}
                  watch={watch}
                  resetField={resetField}
                  disabled={
                    !allowed_roles.includes(user?.role) &&
                    defaultValues?.status?.state != undefined &&
                    defaultValues?.status?.state != "incomplete"
                  }
                  eventid={defaultValues?._id}
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
            >
              Media
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <FileUpload
                  type="image"
                  name="poster"
                  label="Poster"
                  control={control}
                  maxFiles={1}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container item direction="row" xs={12} spacing={1} pt={3}>
            <Grid item xs={6}>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
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
              {allowed_roles.includes(user?.role) ||
              (user?.role === "club" &&
                defaultValues?.status?.state != undefined &&
                defaultValues?.status?.state != "incomplete") ? (
                <LoadingButton
                  loading={loading}
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={budgetEditing}
                >
                  Save
                </LoadingButton>
              ) : (
                <LoadingButton
                  loading={loading}
                  type="submit"
                  size="large"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={budgetEditing}
                >
                  Save as draft
                </LoadingButton>
              )}
            </Grid>
            {allowed_roles.includes(user?.role) ||
            (user?.role === "club" &&
              defaultValues?.status?.state != undefined &&
              defaultValues?.status?.state != "incomplete") ? null : (
              <Grid item xs={12}>
                <LoadingButton
                  loading={loading}
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    handleSubmit((data) =>
                      onSubmit(data, { shouldSubmit: true }),
                    )()
                  }
                  disabled={budgetEditing}
                >
                  Save & Submit
                </LoadingButton>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

// select club to which event belongs to
function EventClubSelect({ control, disabled = true }) {
  const { triggerToast } = useToast();

  // fetch list of clubs
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await fetch("/actions/clubs/ids");
      res = await res.json();
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
      name="clubid"
      control={control}
      rules={{ required: "Select a club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="clubid">Club *</InputLabel>
          <Select
            labelId="clubid"
            label="clubid *"
            fullWidth
            disabled={disabled}
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

// event name input
function EventNameInput({ control, disabled = true }) {
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        minLength: {
          value: 5,
          message: "Event name must be at least 5 characters long!",
        },
        maxLength: {
          value: 150,
          message: "Event name must be at most 150 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Name"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          required
          disabled={disabled}
        />
      )}
    />
  );
}

// event datetime range input
function EventDatetimeInput({
  control,
  watch,
  disabled = true,
  role = "public",
}) {
  const startDateInput = watch("startTime");
  const endDateInput = watch("endTime");
  const [error, setError] = useState(null);

  const errorMessage = useMemo(() => {
    switch (error) {
      case "minDate": {
        return "An event can not end before it starts!";
      }
      case "invalidDate": {
        return "Invalid date!";
      }
      default: {
        return "";
      }
    }
  }, [error]);

  return (
  <>
    <Typography
      color="text.secondary"
      sx={{fontSize: '1', textAlign: 'center', marginBottom: '20px', fontWeight: 100}}
    >
      (All times are in IST)
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={6} xl={4}>
        <Controller
          name="startTime"
          control={control}
          rules={{
            required: "Start date is required!",
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DateTimePicker
              label="Starts *"
              slotProps={{
                textField: {
                  error: invalid,
                  helperText: error?.message,
                },
              }}
              disablePast={!allowed_roles.includes(role)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              maxDateTime={
                endDateInput
                  ? dayjs(endDateInput).subtract(1,"minute")
                  : null
              }
              sx={{ width: "100%" }}
              value={
                value instanceof Date && !isDayjs(value) ? dayjs(value) : value
              }
              disabled={disabled}
              {...rest}
            />
          )}
        />
	      </Grid>
      <Grid item xs xl={4}>
        <Controller
          name="endTime"
          control={control}
          rules={{
            required: "End date is required!",
            validate: {
              checkDate: (value) => {
                return (
                  dayjs(value) >= dayjs(startDateInput) ||
                  "Event must end after it starts!"
                );
              },
            },
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DateTimePicker
              label="Ends *"
              disabled={!startDateInput || disabled}
              minDateTime={
                startDateInput
                  ? dayjs(startDateInput).add(1,"minute")
                  : null
              }
              disablePast={!allowed_roles.includes(role)}
              slotProps={{
                textField: {
                  error: errorMessage || invalid,
                  helperText: errorMessage || error?.message,
                },
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              sx={{ width: "100%" }}
              value={
                value instanceof Date && !isDayjs(value) ? dayjs(value) : value
              }
              {...rest}
            />
          )}
        />
      </Grid>
    </Grid>
  </>
  );
}

// event audience selector
function EventAudienceSelect({ control }) {
  const { field } = useController({
    name: "audience",
    control,
  });

  const handleChange = (event, newValue) => {
    if (field.value.includes("internal")) {
      const index = newValue.indexOf("internal");
      if (index > -1) newValue.splice(index, 1);
      field.onChange(newValue);
    } else if (
      !field.value.includes("internal") &&
      newValue.includes("internal")
    ) {
      field.onChange(["internal"]);
    } else {
      field.onChange(newValue);
    }
  };
  return (
    <Box>
      <InputLabel shrink>Audience</InputLabel>
      <ToggleButtonGroup
        {...field}
        color="primary"
        onChange={(u, v) => handleChange(u, v)}
        sx={{ display: "flex", flexWrap: "wrap" }}
      >
        {Object.keys(audienceMap).map((key) => (
          <ToggleButton disableRipple key={key} value={key}>
            {audienceMap[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

// event description input
function EventDescriptionInput({ control }) {
  return (
    <Controller
      name="description"
      control={control}
      rules={{
        maxLength: {
          value: 4000,
          message: "Event description must be at most 4000 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Description"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          rows={8}
          fullWidth
          multiline
        />
      )}
    />
  );
}

// // event link input
// function EventLinkInput({ control }) {
//   return (
//     <Controller
//       name="link"
//       control={control}
//       rules={{}}
//       render={({ field, fieldState: { error, invalid } }) => (
//         <TextField
//           {...field}
//           label="Link"
//           autoComplete="off"
//           error={invalid}
//           helperText={
//             error?.message ||
//             "Link to event page or registration form (if applicable)"
//           }
//           variant="outlined"
//           fullWidth
//         />
//       )}
//     />
//   );
// }

// conditional event venue selector
function EventVenueInput({
  control,
  watch,
  resetField,
  disabled = true,
  eventid = null,
}) {
  const modeInput = watch("mode");
  const locationInput = watch("location");
  const startDateInput = watch("startTime");
  const endDateInput = watch("endTime");

  // reset location if datetime changes
  useEffect(() => resetField("location"), [startDateInput, endDateInput]);

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <Box>
              <InputLabel shrink>Mode</InputLabel>
              <ToggleButtonGroup
                {...field}
                exclusive
                color="primary"
                disabled={disabled}
              >
                <ToggleButton disableRipple key={0} value="online">
                  Online
                </ToggleButton>
                <ToggleButton disableRipple key={1} value="hybrid">
                  Hybrid
                </ToggleButton>
                <ToggleButton disableRipple key={2} value="offline">
                  Offline
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        />
      </Grid>

      {/* show venue selector if event is hybrid or offline*/}
      <Grid item xs={12}>
        {["hybrid", "offline"].includes(modeInput) ? (
          // show venue selector if start and end dates are set
          startDateInput && endDateInput ? (
            <EventLocationInput
              control={control}
              startDateInput={startDateInput}
              endDateInput={endDateInput}
              disabled={disabled}
              eventid={eventid}
            />
          ) : (
            <FormHelperText>
              Enter start and end dates to get available venues
            </FormHelperText>
          )
        ) : null}
      </Grid>

      {/* show location details input if venue is requested */}
      {locationInput?.length ? (
        <>
          <Grid item xs={12}>
            <Controller
              name="population"
              control={control}
              rules={{
                min: {
                  value: 1,
                  message: "Expected population count must be at least 1!",
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  type="number"
                  label="Expected Population Count*"
                  error={invalid}
                  helperText={error?.message}
                  autoComplete="off"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  disabled={false}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="equipment"
              control={control}
              rules={{
                maxLength: {
                  value: 800,
                  message:
                    "Equipment field must be at most 800 characters long!",
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  label="Equipment Required (if any)"
                  autoComplete="off"
                  error={invalid}
                  helperText={error?.message}
                  variant="outlined"
                  rows={4}
                  fullWidth
                  multiline
                  disabled={false}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="additional"
              control={control}
              rules={{
                maxLength: {
                  value: 800,
                  message:
                    "Additional field must be at most 800 characters long!",
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  label="Additional Requests (if any)"
                  autoComplete="off"
                  error={invalid}
                  helperText={error?.message}
                  variant="outlined"
                  rows={4}
                  fullWidth
                  multiline
                  disabled={false}
                />
              )}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  );
}

// select location from available rooms
function EventLocationInput({
  control,
  startDateInput,
  endDateInput,
  disabled = true,
  eventid = null,
}) {
  const [availableRooms, setAvailableRooms] = useState([]);
  useEffect(() => {
    if (!(startDateInput && endDateInput)) return;

    if (new Date(startDateInput) > new Date(endDateInput)) {
      setAvailableRooms([]);
      return;
    }

    (async () => {
      let res = await fetch("/actions/events/venues", {
        method: "POST",
        body: JSON.stringify({
          startDate: new Date(startDateInput).toISOString(),
          endDate: new Date(endDateInput).toISOString(),
          eventid: eventid,
        }),
      });
      res = await res.json();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch available rooms",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setAvailableRooms(res.data);
      }
    })();
  }, [startDateInput, endDateInput]);

  return (
    <Controller
      name="location"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="locationSelect">Location</InputLabel>
          <Select
            multiple
            id="location"
            labelId="locationSelect"
            disabled={
              !(startDateInput && endDateInput) ||
              disabled ||
              !availableRooms?.locations?.length
            }
            input={<OutlinedInput label="Location" />}
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={locationLabel(value)?.name} />
                ))}
              </Box>
            )}
            {...field}
          >
            {availableRooms?.locations
              ?.slice()
              ?.sort()
              ?.map((location) => (
                <MenuItem key={location} value={location}>
                  {locationLabel(location)?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    />
  );
}

// input event budget as a table
function EventBudgetTable({
  control,
  watch,
  disabled = true,
  setBudgetEditing = null,
}) {
  return (
    <Controller
      name="budget"
      control={control}
      render={({ field: { value, onChange } }) => (
        <EventBudget
          editable={!disabled}
          rows={value}
          setRows={onChange}
          setBudgetEditing={setBudgetEditing}
        />
      )}
    />
  );
}

// input event POC
function EventPOC({
  control,
  watch,
  cid,
  hasPhone,
  setHasPhone,
  disabled = false,
}) {
  const { triggerToast } = useToast();
  const poc = watch("poc");

  // fetch list of current members
  const [members, setMembers] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await fetch("/actions/members/current", {
        method: "POST",
        body: JSON.stringify({ clubInput: { cid } }),
      });
      res = await res.json();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch members",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setMembers(res.data);
      }
    })();
  }, [cid]);

  // fetch phone number of selected member
  useEffect(() => {
    if (poc) {
      (async () => {
        let res = await fetch("/actions/users/get/full", {
          method: "POST",
          body: JSON.stringify({ uid: poc }),
        });
        res = await res.json();
        if (!res.ok) {
          triggerToast({
            title: "Unable to fetch phone number",
            messages: res.error.messages,
            severity: "error",
          });
        } else {
          // console.log(res.data);
          if (res.data?.phone) setHasPhone(true);
          else setHasPhone(false);
        }
      })();
    }
  }, [poc]);

  return (
    <>
      <Controller
        name="poc"
        disabled={disabled}
        control={control}
        rules={{ required: "Select a member!" }}
        render={({ field, fieldState: { error, invalid } }) => (
          <FormControl fullWidth error={invalid}>
            <InputLabel id="poc">Point of Contact *</InputLabel>
            {members.length === 0 ? (
              <Box py={25} width="100%" display="flex" justifyContent="center">
                <Fade in>
                  <CircularProgress color="primary" />
                </Fade>
              </Box>
            ) : (
              <Select
                labelId="poc"
                label="Point of Contact *"
                fullWidth
                {...field}
                MenuProps={{
                  style: { maxHeight: 400 },
                }}
              >
                {members?.slice()?.map((member) => (
                  <MenuItem key={member._id} value={member.uid}>
                    <MemberListItem uid={member.uid} />
                  </MenuItem>
                ))}
              </Select>
            )}
            <FormHelperText>{error?.message}</FormHelperText>
          </FormControl>
        )}
      />

      {disabled || members.length === 0 || !poc || hasPhone ? null : (
        <Box mt={2}>
          <Controller
            name="poc_phone"
            control={control}
            rules={{
              validate: {
                checkPhoneNumber: (value) => {
                  if (!value || value === "") return true;
                  try {
                    const phoneNumber = parsePhoneNumberWithError(value, {
                      defaultCountry: "IN",
                    });
                    return (
                      isValidPhoneNumber(value, "IN") || "Invalid Phone Number!"
                    );
                  } catch (error) {
                    return error.message;
                  }
                },
              },
              required: "POC Phone number is required!",
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                error={invalid}
                helperText={error?.message}
                label="Phone Number"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Box>
      )}
    </>
  );
}
