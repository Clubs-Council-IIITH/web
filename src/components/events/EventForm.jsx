"use client";

import dayjs from "dayjs";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";

import { useMutation } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { CREATE_EVENT, EDIT_EVENT } from "gql/mutations/events";
import { GET_AVAILABLE_LOCATIONS } from "gql/queries/events";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";

import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import {
  Box,
  Button,
  Chip,
  Grid,
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

import FileUpload from "components/FileUpload";
import EventBudget from "./EventBudget";

import { uploadFile } from "utils/files";
import { audienceMap } from "constants/events";
import { locationLabel } from "utils/formatEvent";
import { useAuth } from "components/AuthProvider";

export default function EventForm({
  id = null,
  defaultValues = {},
  action = "log",
}) {
  const router = useRouter();
  const { user } = useAuth();

  const { control, handleSubmit, watch, resetField } = useForm({
    defaultValues,
  });
  const { triggerToast } = useToast();

  // mutations
  const [createEvent] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      // show success toast
      triggerToast({
        title: "Success!",
        messages: ["Event created successfully."],
        severity: "success",
      });

      // redirect to manage page
      router.push("/manage/events");
    },
    onError: (error) => {
      // show error toast
      triggerToast({
        title: error.name,
        messages: error?.graphQLErrors?.map((g) => g?.message),
        severity: "error",
      });
    },
  });
  const [editEvent] = useMutation(EDIT_EVENT, {
    onCompleted: () => {
      // show success toast
      triggerToast({
        title: "Success!",
        messages: ["Event edited successfully."],
        severity: "success",
      });

      // redirect to manage page
      router.push("/manage/events");
    },
    onError: (error) => {
      // show error toast
      triggerToast({
        title: error.name,
        messages: error?.graphQLErrors?.map((g) => g?.message),
        severity: "error",
      });
    },
  });

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
    create: (data) => createEvent({ variables: { details: data } }),
    edit: (data) =>
      editEvent({ variables: { details: { ...data, eventid: id } } }),
  };

  async function onSubmit(formData) {
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
    };

    // set club ID for event based on user role
    if (user?.role === "club") {
      data.clubid = user?.uid;
    } else if (user?.role === "cc") {
      data.clubid = formData.clubid;
    }

    // upload poster
    if (formData?.poster && typeof formData?.poster !== "string") {
      data.poster = formData?.poster?.[0]
        ? await uploadFile(formData?.poster?.[0], "image")
        : null;
    }

    // convert dates to ISO strings
    data.datetimeperiod = formData.datetimeperiod.map((d) =>
      new Date(d).toISOString()
    );

    // convert budget to array of objects with only required attributes
    // remove budget items without a description (they're invalid)
    data.budget = formData.budget
      .filter((i) => i?.description)
      .map((i) => ({
        description: i.description,
        amount: i.amount,
        advance: i.advance,
      }));

    // TODO: fix event link field
    data.link = null;

    // mutate
    submitHandlers[action](data);
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
              <Grid item xs={12}>
                <EventClubSelect control={control} />
              </Grid>
              <Grid item xs={12}>
                <EventNameInput control={control} />
              </Grid>
              <Grid item xs={12}>
                <EventDatetimeInput control={control} watch={watch} />
              </Grid>
              <Grid item xs={12}>
                <EventAudienceSelect control={control} />
              </Grid>
              <Grid item xs={12}>
                <EventDescriptionInput control={control} />
              </Grid>
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
                <EventBudgetTable control={control} watch={watch} />
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

          <Grid container item direction="row" xs={12} spacing={2} pt={3}>
            <Grid item xs={6}>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

// select club to which event belongs to
function EventClubSelect({ control }) {
  const { data: { allClubs: clubs } = {} } = useSuspenseQuery(GET_ALL_CLUB_IDS);

  return (
    <Controller
      name="clubid"
      control={control}
      rules={{ required: "Select a club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="clubid">Club *</InputLabel>
          <Select labelId="clubid" label="clubid *" fullWidth {...field}>
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
function EventNameInput({ control }) {
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
          value: 50,
          message: "Event name must be at most 50 characters long!",
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
        />
      )}
    />
  );
}

// event datetime range input
function EventDatetimeInput({ control, watch }) {
  const startDateInput = watch("datetimeperiod.0");
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
    <Grid container spacing={2}>
      <Grid item xs={6} xl={4}>
        <Controller
          name="datetimeperiod.0"
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
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              sx={{ width: "100%" }}
              value={value ? dayjs(value) : value}
              {...rest}
            />
          )}
        />
      </Grid>
      <Grid item xs xl={4}>
        <Controller
          name="datetimeperiod.1"
          control={control}
          rules={{
            required: "End date is required!",
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DateTimePicker
              label="Ends *"
              disabled={!startDateInput}
              minDate={startDateInput}
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
              value={value ? dayjs(value) : value}
              {...rest}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

// event audience selector
function EventAudienceSelect({ control }) {
  return (
    <Controller
      name="audience"
      control={control}
      render={({ field }) => (
        <Box>
          <InputLabel shrink>Audience</InputLabel>
          <ToggleButtonGroup
            {...field}
            color="primary"
            onChange={(_, v) => field.onChange(v)}
          >
            {Object.keys(audienceMap).map((key) => (
              <ToggleButton disableRipple key={key} value={key}>
                {audienceMap[key]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}
    />
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
          value: 1000,
          message: "Event description must be at most 1000 characters long!",
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

// event link input
function EventLinkInput({ control }) {
  return (
    <Controller
      name="link"
      control={control}
      rules={{}}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Link"
          autoComplete="off"
          error={invalid}
          helperText={
            error?.message ||
            "Link to event page or registration form (if applicable)"
          }
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}

// conditional event venue selector
function EventVenueInput({ control, watch, resetField }) {
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
              <ToggleButtonGroup {...field} exclusive color="primary">
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
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="equipment"
              control={control}
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
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="additional"
              control={control}
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
function EventLocationInput({ control, startDateInput, endDateInput }) {
  const { data: { availableRooms } = {} } = useSuspenseQuery(
    GET_AVAILABLE_LOCATIONS,
    {
      skip: !(startDateInput && endDateInput),
      variables: {
        timeslot: [
          new Date(startDateInput).toISOString(),
          new Date(endDateInput).toISOString(),
        ],
      },
    }
  );

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
            disabled={!(startDateInput && endDateInput)}
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
function EventBudgetTable({ control, watch }) {
  return (
    <Controller
      name="budget"
      control={control}
      render={({ field: { value, onChange } }) => (
        <EventBudget editable rows={value} setRows={onChange} />
      )}
    />
  );
}
