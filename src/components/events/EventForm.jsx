"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
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
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";

import Icon from "components/Icon";
import FileUpload from "components/FileUpload";

import { uploadFile } from "utils/files";
import { audienceMap } from "constants/events";
import { locationLabel } from "utils/formatEvent";

export default function EventForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();

  const { control, handleSubmit, watch, resetField } = useForm({
    defaultValues,
  });
  const { triggerToast } = useToast();

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
  };

  async function onSubmit(formData) {}

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
              <Grid item xs={12}>
                <EventLinkInput control={control} />
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
              Budget
            </Typography>
            {/* TODO */}
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
      rules={{ required: true }}
      render={({ field }) => (
        <FormControl fullWidth>
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
            required: true,
          }}
          render={({ field }) => (
            <DateTimePicker
              label="Starts *"
              renderInput={(props) => <TextField {...props} />}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              sx={{ width: "100%" }}
              {...field}
            />
          )}
        />
      </Grid>
      <Grid item xs xl={4}>
        <Controller
          name="datetimeperiod.1"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <DateTimePicker
              label="Ends *"
              disabled={!startDateInput}
              minDate={startDateInput}
              onError={(error) => setError(error)}
              slotProps={{
                textField: {
                  helperText: errorMessage,
                },
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              sx={{ width: "100%" }}
              {...field}
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
