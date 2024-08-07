"use client";

import dayjs, { isDayjs } from "dayjs";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useForm, Controller, useController } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import InfoIcon from "@mui/icons-material/Info";
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
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Select,
  Switch,
  MenuItem,
} from "@mui/material";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

import { useAuth } from "components/AuthProvider";
import { useToast } from "components/Toast";
import FileUpload from "components/FileUpload";
import EventBudget from "components/events/EventBudget";
import ConfirmDialog from "components/ConfirmDialog";
import EventsDialog from "components/events/EventsDialog";
import MemberListItem from "components/members/MemberListItem";

import { uploadFile } from "utils/files";
import { audienceMap } from "constants/events";
import { locationLabel } from "utils/formatEvent";

const allowed_roles = ["cc", "slo"];

export default function EventForm({
  id = null,
  defaultValues = {},
  action = "log",
  existingEvents = [],
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [budgetEditing, setBudgetEditing] = useState(false);
  const [hasPhone, setHasPhone] = useState(true);

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

  const { control, handleSubmit, watch, resetField } = useForm({
    defaultValues,
  });
  const { triggerToast } = useToast();
  const collabEvent = watch("collabEvent");

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
      location: formData.mode === "online" ? null : formData.location,
      population: parseInt(formData.population),
      additional: formData.additional,
      equipment: formData.equipment,
      poc: formData.poc,
    };

    if(collabEvent){
      data.collabclubs = formData.collaboratingClubs;
    }
    else{
      data.collabclubs = [];
    }

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
    data.datetimeperiod = formData.datetimeperiod.map((d) =>
      new Date(d).toISOString(),
    );

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
    console.log(data);
    // mutate
    submitHandlers[action](data, opts);
  }
  const [selectedClub, setSelectedClub] = useState([]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid container item xs={12} md={7} xl={8} spacing={3}>
          <Grid container item>
            <Grid
              container
              item
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                color="text.secondary"
                gutterBottom
                mb={2}
              >
                Details
              </Typography>
              <FormControlLabel
                control={
                  <Controller
                    name="collabEvent"
                    control={control}
                    defaultValue={defaultValues.collabclubs==undefined
                                    ? false:
                                    defaultValues.collabclubs.length==0
                                      ? false :
                                      true
                    }
                    
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        disabled={
                          user?.role != "cc" &&
                          defaultValues?.status?.state != undefined &&
                          defaultValues?.status?.state != "incomplete"
                        }
                        onChange={(e) => field.onChange(e.target.checked)}
                        inputProps={{ "aria-label": "controlled" }}
                        sx={{ margin: "auto" }}
                      />
                    )}
                  />
                }
                label="Collaboration Event"
              />
            </Grid>
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
                    clubs={clubs}
                    onSelect={(clubId) => setSelectedClub(clubId)}
                  />
                </Grid>
              ) : null}
              {collabEvent ? (
              <Grid item xs={12}>
                <EventCollabClubSelect
                  control={control}
                  disabled={
                    user?.role != "cc" &&
                    defaultValues?.status?.state != undefined &&
                    defaultValues?.status?.state != "incomplete"
                  }
                  defaultValue={(defaultValues.collabclubs!=undefined && defaultValues?.collabclubs.length!=0)?defaultValues.collabclubs:[]}
                  clubs={clubs.filter(club => !selectedClub.includes(club.cid))}
                />
              </Grid>) : null}
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
                  existingEvents={existingEvents}
                  clubs={clubs}
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
                      defaultValues?.datetimeperiod[0] &&
                      new Date(defaultValues?.datetimeperiod[0]) < new Date()
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
function EventClubSelect({ control, disabled = true, clubs = [], onSelect }) {
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
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(event);
              onSelect(value);
            }}
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

function EventCollabClubSelect({ control, disabled = true, clubs = [] ,defaultValue}) {
  const { triggerToast } = useToast();
  const [open, setOpen] = useState(false);
  const handleDone = () => {
    setOpen(false);
  };
  return (
    <Controller
      name="collaboratingClubs"
      control={control}
      defaultValue={defaultValue} // Ensure default value is an array
      rules={{ required: "Select at least one collaborating club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="collaboratingClubs">Collaborating Clubs *</InputLabel>
          <Select
            labelId="collaboratingClubs"
            label="Collaborating Clubs *"
            fullWidth
            multiple
            disabled={disabled}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            value={field.value || []} // Ensure the value is an array
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
            {open && (<MenuItem>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Button variant="contained" color="primary" onClick={handleDone}>
                  Done
                </Button>
              </Box>
            </MenuItem>)};
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

function filterEvents(events, startTime, endTime) {
  let filteredEvents = events.filter((event) => {
    const eventStart = new Date(event.datetimeperiod[0]);
    const eventEnd = new Date(event.datetimeperiod[1]);

    return (
      (startTime >= eventStart && startTime < eventEnd) ||
      (endTime > eventStart && endTime <= eventEnd) ||
      (startTime <= eventStart && endTime >= eventEnd)
    );
  });

  if (filteredEvents.length) return filteredEvents;
  return null;
}

// event datetime range input
function EventDatetimeInput({
  control,
  watch,
  disabled = true,
  role = "public",
  existingEvents = [],
  clubs = [],
}) {
  const startDateInput = watch("datetimeperiod.0");
  const endDateInput = watch("datetimeperiod.1");
  const [error, setError] = useState(null);
  const [eventsDialogOpen, setEventsDialogOpen] = useState(false);

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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} xl={4}>
        <Controller
          name="datetimeperiod.0"
          control={control}
          rules={{
            required: "Start date is required!",
            validate: {
              minDateCheck: (value) =>
                allowed_roles.includes(role) ||
                dayjs(value) >= dayjs(new Date()) ||
                "Start Date must not be in past!",
            },
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
              sx={{ width: "100%" }}
              value={
                value instanceof Date && !isDayjs(value) ? dayjs(value) : value
              }
              disabled={disabled}
              format="DD/MM/YYYY hh:mm A"
              {...rest}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6} xl={4}>
        <Controller
          name="datetimeperiod.1"
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
              minDateTime={
                startDateInput
                  ? (startDateInput instanceof Date && !isDayjs(startDateInput)
                    ? dayjs(startDateInput)
                    : startDateInput
                  ).add(1, "minute")
                  : null
              }
              disablePast={!allowed_roles.includes(role)}
              onError={(error) => setError(error)}
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
              disabled={!startDateInput || disabled}
              format="DD/MM/YYYY hh:mm A"
              {...rest}
            />
          )}
        />
      </Grid>
      {startDateInput && endDateInput ? (
        <>
          {existingEvents?.length ? (
            filterEvents(existingEvents, startDateInput, endDateInput) ? (
              <Grid item xs={8} xl={4}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  height="100%"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<InfoIcon />}
                    onClick={() => setEventsDialogOpen(true)}
                  >
                    Clashing Events
                  </Button>
                </Box>

                <EventsDialog
                  open={eventsDialogOpen}
                  onClose={() => setEventsDialogOpen(false)}
                  events={filterEvents(
                    existingEvents,
                    startDateInput,
                    endDateInput,
                  )}
                  clubs={clubs}
                />
              </Grid>
            ) : null
          ) : null}
        </>
      ) : null}
    </Grid>
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
  const startDateInput = watch("datetimeperiod.0");
  const endDateInput = watch("datetimeperiod.1");

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

      <Grid item xs={12}>
        <Controller
          name="population"
          control={control}
          rules={{
            min: {
              value: 1,
              message: "Expected participation count must be at least 1.",
            },
          }}
          render={({ field, fieldState: { error, invalid } }) => (
            <TextField
              type="number"
              label="Expected Participation*"
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

      {/* show location details input if venue is requested */}
      {locationInput?.length ? (
        <>
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
