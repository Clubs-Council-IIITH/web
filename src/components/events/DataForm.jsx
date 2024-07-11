"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  MenuItem,
  CircularProgress,
  Switch,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { LoadingButton } from "@mui/lab";

const allowed_roles = ["cc", "club", "slo"];
const admin_roles = ["cc", "slo"];
const disabledFields = ["code", "name", "clubid", "datetimeperiod.0", "status"]; // Fields that should be disabled and selected

function DataClubSelect({ control, disabled = true }) {
  const { triggerToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/actions/clubs/ids");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error.messages);
        }
        setClubs(data.data);
        setLoading(false);
      } catch (error) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: error.message,
          severity: "error",
        });
      }
    })();
  }, [triggerToast]);

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : clubs.length > 0 ? (
        <Controller
          name="clubid"
          control={control}
          rules={{ required: "Select a club/body!" }}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormControl fullWidth error={invalid}>
              <InputLabel id="clubid">Club/Body</InputLabel>
              <Select labelId="clubid" fullWidth disabled={disabled} {...field}>
                <MenuItem value="allclubs">All Clubs/Bodies</MenuItem>
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
      ) : (
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            padding: 1.7,
            color: "#919EAB",
            width: "100%",
            border: "1px solid rgba(99, 115, 129, 0.5)",
            borderRadius: "8px",
          }}
        >
          No clubs available
        </Typography>
      )}
    </>
  );
}

function EventDatetimeInput({ control, watch, user }) {
  const startDateInput = watch("datetimeperiod.0");
  return (
    <Grid container item direction="row" xs={12} spacing={1} pt={1}>
      <Grid item xs={6}>
        <Controller
          name="datetimeperiod.0"
          control={control}
          rules={{
            required: "Start date is required!",
            validate: {
              maxDateCheck: (value) =>
                dayjs(value) < dayjs(new Date()) || admin_roles.includes(user?.role)  ||
                "Start Date must be before today!",
            },
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DatePicker
              label="From Date"
              slotProps={{
                textField: {
                  error: invalid,
                  helperText: error?.message,
                },
              }}
              maxDate={admin_roles.includes(user?.role) ? null : dayjs(new Date()).subtract(1, "day")}
              disableFuture = {admin_roles.includes(user?.role) ? false : true}
              sx={{ width: "100%" }}
              value={value instanceof Date ? dayjs(value) : value}
              {...rest}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="datetimeperiod.1"
          control={control}
          rules={{
            required: "End date is required!",
            validate: {
              checkDate: (value) =>
                dayjs(value) > dayjs(startDateInput) || admin_roles.includes(user?.role)  ||
                "End Date must be after Start Date!",
              maxDateCheck: (value) =>
                dayjs(value) <= dayjs(new Date()) || admin_roles.includes(user?.role)  ||
                "End Date must be till today!",
            },
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DatePicker
              label="To Date"
              disabled={!startDateInput}
              minDate={startDateInput && dayjs(startDateInput).add(1, "day")}
              disableFuture = {admin_roles.includes(user?.role) ? false : true}
              slotProps={{
                textField: {
                  error: error || invalid,
                  helperText: error?.message,
                },
              }}
              sx={{ width: "100%" }}
              value={value instanceof Date ? dayjs(value) : value}
              {...rest}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default function DataForm({ defaultValues = {}, action = "log" }) {
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      clubid: "",
      datetimeperiod: [null, null],
      fields: disabledFields, // Ensure disabled fields are selected by default
      allEvents: false,
      ...defaultValues,
    },
  });
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const allEvents = watch("allEvents");

  const submitHandlers = {
    log: console.log,
    create: async (data) => {
      console.log(data);
      let res = await fetch("/actions/events/data", {
        method: "POST",
        body: JSON.stringify({ details: data }),
      });

      if (res.ok) {
        try {
          const jsonResponse = await res.json();
          const csvContent = jsonResponse.data.downloadEventsData.csvFile;

          if (csvContent) {
            const csvBlob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const csvFileName = `events_data_${dayjs(new Date()).format(
              "YYYY-MM-DD",
            )}.csv`;
            const downloadLink = document.createElement("a");
            const url = URL.createObjectURL(csvBlob);

            downloadLink.href = url;
            downloadLink.download = csvFileName;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          } else {
            console.error("No CSV content received");
          }
        } catch (error) {
          console.error("Failed to parse JSON response");
          triggerToast(error, "error");
        }
      } else {
        console.error("Failed to fetch CSV file");
        triggerToast(error, "error");
      }
    },
  };

  async function onSubmit(formData) {
    setLoading(true);
    const data = {
      clubid: admin_roles.includes(user?.role) ? formData.clubid : user?.uid,
      dateperiod: formData.datetimeperiod.map((date) =>
        dayjs(date).format("YYYY-MM-DD"),
      ),
      fields: formData.fields,
      allEvents: formData.allEvents,
    };
    submitHandlers[action](data);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        item
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h3" gutterBottom mb={3}>
          Download Events Data
        </Typography>
        {admin_roles.includes(user?.role) ? (
          <FormControlLabel
            control={
              <Controller
                name="allEvents"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ margin: "auto" }}
                  />
                )}
              />
            }
            label="All Events"
          />
        ) : null}
      </Grid>
      <Grid container spacing={4} alignItems="flex-start">
        <Grid container item>
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
            >
              {admin_roles.includes(user?.role)
                ? "Select Club/Student Body"
                : "Selected Club/Student Body"}
            </Typography>
            <Grid item xs={12}>
              {admin_roles.includes(user?.role) ? (
                <DataClubSelect
                  control={control}
                  disabled={!admin_roles.includes(user?.role)}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: 18,
                    padding: 1.7,
                    color: "#919EAB",
                    width: "100%",
                    border: "1px solid rgba(99, 115, 129, 0.5)",
                    borderRadius: "8px",
                  }}
                >
                  {user?.uid}
                </Typography>
              )}
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
            Date Range
          </Typography>
          <EventDatetimeInput control={control} watch={watch} user={user}/>
        </Grid>
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            gutterBottom
          >
            Fields to Include
          </Typography>
          <Controller
            name="fields"
            control={control}
            rules={{ required: "Select at least one field!" }}
            render={({ field, fieldState: { error } }) => (
              <FormControl component="fieldset" fullWidth error={error}>
                <FormGroup row>
                  <Grid container item spacing={1} ml={1}>
                    {[
                      { fieldValue: "code", fieldName: "Event Code" },
                      { fieldValue: "name", fieldName: "Event Name" },
                      { fieldValue: "clubid", fieldName: "Club" },
                      {
                        fieldValue: "datetimeperiod.0",
                        fieldName: "Start Date",
                      },
                      { fieldValue: "datetimeperiod.1", fieldName: "End Date" },
                      { fieldValue: "description", fieldName: "Description" },
                      { fieldValue: "audience", fieldName: "Audience" },
                      { fieldValue: "population", fieldName: "Audience Count" },
                      { fieldValue: "mode", fieldName: "Mode" },
                      { fieldValue: "location", fieldName: "Venue" },
                      { fieldValue: "budget", fieldName: "Budget" },
                      { fieldValue: "poster", fieldName: "Poster URL" },
                      ...(allEvents
                        ? [{ fieldValue: "status", fieldName: "Status" }]
                        : []),
                    ].map(({ fieldValue, fieldName }) => (
                      <Grid item lg={2} md={3} sm={4} xs={6} key={fieldValue}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value={fieldValue}
                              checked={field.value.includes(fieldValue)}
                              disabled={disabledFields.includes(fieldValue)}
                              onChange={(event) => {
                                const newValue = [...field.value];
                                if (event.target.checked) {
                                  newValue.push(event.target.value);
                                } else {
                                  const index = newValue.indexOf(
                                    event.target.value,
                                  );
                                  if (index > -1) {
                                    newValue.splice(index, 1);
                                  }
                                }
                                field.onChange(newValue);
                              }}
                            />
                          }
                          label={fieldName}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
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
            Reset
          </Button>

          <ConfirmDialog
            open={cancelDialog}
            title="Confirm resetting"
            description="Are you sure you want to reset? All the selections will be lost."
            onConfirm={() => {
              reset();
              setCancelDialog(false);
            }}
            onClose={() => setCancelDialog(false)}
            confirmProps={{ color: "primary" }}
            confirmText="Yes, discard my changes"
          />
        </Grid>
        <Grid item xs={6}>
          {allowed_roles.includes(user?.role) && (
            <LoadingButton
              loading={loading}
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              fullWidth
            >
              Download CSV
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
}
