"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import {
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
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { LoadingButton } from "@mui/lab";

const allowed_roles = ["cc", "club", "slo"];
const admin_roles = ["cc", "slo"];

function ReportClubSelect({ control, disabled = true }) {
  const { triggerToast } = useToast();
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/actions/clubs/ids");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error.messages);
        }
        setClubs(data.data);
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
  );
}

function EventDatetimeInput({ control, watch, disabled = true }) {
  const startDateInput = watch("datetimeperiod.0");
  return (
    <Grid container item direction="row" xs={12} spacing={1} pt={1}>
      <Grid item xs={6}>
        <Controller
          name="datetimeperiod.0"
          control={control}
          rules={{ required: "Start date is required!" }}
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
              maxDate={dayjs(new Date()).subtract(1, "day")}
              disableFuture
              sx={{ width: "100%" }}
              value={value instanceof Date ? dayjs(value) : value}
              disabled={disabled}
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
                dayjs(value) > dayjs(startDateInput) ||
                "End Date must be after Start Date!",
            },
          }}
          render={({
            field: { value, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DatePicker
              label="To Date"
              disabled={!startDateInput || disabled}
              minDate={startDateInput && dayjs(startDateInput).add(1, "day")}
              disableFuture
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

export default function ReportForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const { control, handleSubmit, watch, reset } = useForm({ defaultValues });
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const submitHandlers = {
    log: console.log,
    create: async (data, opts) => {
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
            const csvFileName = "report.csv";
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

  async function onSubmit(formData, opts) {
    setLoading(true);
    const data = {
      clubid: admin_roles.includes(user?.role) ? formData.clubid : user?.uid,
      dateperiod: formData.datetimeperiod.map((date) =>
        dayjs(date).format("YYYY-MM-DD"),
      ),
      fields: formData.fields,
    };
    submitHandlers[action](data, opts);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                <ReportClubSelect
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
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mt={3}
            >
              Range of the Data
            </Typography>
            <Grid item xs={12}>
              <EventDatetimeInput
                control={control}
                watch={watch}
                disabled={
                  !admin_roles.includes(user?.role) &&
                  defaultValues?.status?.state !== undefined &&
                  defaultValues?.status?.state !== "incomplete"
                }
              />
            </Grid>
          </Grid>
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mt={3}
            >
              Required Fields
            </Typography>
            <Grid item xs={12} ml={2}>
              <Controller
                name="fields"
                control={control}
                defaultValue={["code", "name", "clubid", "datetimeperiod.0"]}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <FormGroup row>
                      <FormControlLabel
                        control={<Checkbox checked={true} disabled />}
                        value="code"
                        label="Event Code"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={true} disabled />}
                        value="name"
                        label="Event Name"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={true} disabled />}
                        value="clubid"
                        label="Club"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={true} disabled />}
                        value="datetimeperiod.0"
                        label="Start Date"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("datetimeperiod.1")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([
                                  ...field.value,
                                  "datetimeperiod.1",
                                ]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "datetimeperiod.1",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="End Date"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("description")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "description"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "description",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Description"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("audience")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "audience"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "audience",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Audience"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("population")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "population"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "population",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Audience Count"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("mode")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "mode"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "mode",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Mode"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("location")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "location"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "location",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Venue"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("budget")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "budget"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "budget",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Budget"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value.includes("poster")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, "poster"]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (value) => value !== "poster",
                                  ),
                                );
                              }
                            }}
                          />
                        }
                        label="Poster URL"
                      />
                    </FormGroup>
                  </FormControl>
                )}
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
      </Grid>
    </form>
  );
}
