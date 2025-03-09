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
  Chip,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { LoadingButton } from "@mui/lab";

import { getAllClubIds } from "actions/clubs/all-ids/server_action";
import { membersDataDownload } from "actions/members/data/server_action";

import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);

const allowed_roles = ["cc", "club", "slo", "slc"];
const admin_roles = ["cc", "slo", "slc"];
const disabledFields = ["uid", "clubid"]; // Fields that should be disabled and selected

function DataClubSelect({
  control,
  disabled = true,
  loading = false,
  clubs = [],
}) {
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
          render={({
            field: { onChange, value },
            fieldState: { error, invalid },
          }) => (
            <FormControl fullWidth error={invalid}>
              <InputLabel id="clubid-label">Club/Body</InputLabel>
              <Select
                labelId="clubid-label"
                label="Club/Body"
                fullWidth
                multiple
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          value === "allclubs"
                            ? "All Clubs"
                            : clubs?.find((club) => club.cid === value).name
                        }
                      />
                    ))}
                  </Box>
                )}
                value={value}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  if (value[value.length - 1] === "allclubs") {
                    onChange(["allclubs"]);
                  } else {
                    let index = value.indexOf("allclubs");
                    if (index > -1) value.splice(index, 1);
                    onChange(
                      // On autofill we get a stringified value.
                      typeof value === "string" ? value.split(",") : value,
                    );
                  }
                }}
                disabled={disabled}
              >
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

export default function DataForm({ defaultValues = {}, action = "log" }) {
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      clubid: [],
      fields: disabledFields, // Ensure disabled fields are selected by default
      typeMembers: "current",
      typeRoles: "all",
      batchFiltering: ["allBatches"],
      ...defaultValues,
    },
  });
  const [loading, setLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [cancelDialog, setCancelDialog] = useState(false);
  const typeMembers = watch("typeMembers");
  const dateRolesStart = watch("dateRolesStart");
  const clubid = watch("clubid");
  const batches = [];

  // Generate batches from 2020 to current year
  for (let year = 20; year <= dayjs()["year"]() - 2000; year++) {
    batches.push("2k" + year);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllClubIds();
        if (!res.ok) {
          throw new Error(res.error.messages);
        }
        setClubs(res.data);
        setClubsLoading(false);
      } catch (error) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: [error.message],
          severity: "error",
        });
      }
    })();
  }, []);

  const submitHandlers = {
    log: console.log,
    create: async (data) => {
      let res = await membersDataDownload(data);

      if (res.ok) {
        try {
          const csvContent = res.data.downloadMembersData.csvFile;

          if (csvContent) {
            const csvBlob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const csvFileName = `members_data_${dayjs(new Date()).format(
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
        triggerToast({
          title: "Failed to fetch CSV file",
          messages: [res.error?.messages || "Unknown error"],
          severity: "error",
        });
      }
    },
  };

  async function onSubmit(formData) {
    setLoading(true);
    const data = {
      clubid: admin_roles.includes(user?.role) ? formData.clubid : [user?.uid],
      fields: formData.fields,
      typeMembers: formData.typeMembers,
      typeRoles: formData.typeRoles,
      dateRoles: [
        dayjs(formData.dateRolesStart)["year"](),
        dayjs(formData.dateRolesEnd)["year"](),
      ],
      batchFiltering: formData.batchFiltering,
    };
    submitHandlers[action](data);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h3" gutterBottom mb={3}>
        Download Members Data
      </Typography>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            sx={{ mb: 1.5 }}
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
                loading={clubsLoading}
                clubs={clubs}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  padding: 1.7,
                  color: "#919EAB",
                  width: "100%",
                  border: "1px solid rgba(99, 115, 129, 0.5)",
                  borderRadius: "8px",
                }}
              >
                {clubs.find((club) => club.cid === user?.uid)?.name ||
                  user?.uid}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            Members to Include
          </Typography>
          {!clubid.includes("allclubs") ? (
            <Controller
              name="typeMembers"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="typeMembers">Type of Members</InputLabel>
                  <Select
                    labelId="typeMembers"
                    label="Type of Members"
                    fullWidth
                    {...field}
                  >
                    <MenuItem value="all">All Members</MenuItem>
                    <MenuItem value="current">Only Current Members</MenuItem>
                    <MenuItem value="past">Only Past Members</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                padding: 1.7,
                color: "#919EAB",
                width: "100%",
                border: "1px solid rgba(99, 115, 129, 0.5)",
                borderRadius: "8px",
              }}
            >
              Only Current Members
            </Typography>
          )}
        </Grid>
        {typeMembers === "current" ? (
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              Roles to Include
            </Typography>
            <Controller
              name="typeRoles"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="typeRoles">Type of Roles</InputLabel>
                  <Select
                    labelId="typeRoles"
                    label="Type of Roles"
                    fullWidth
                    {...field}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="current">Only Current Roles</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        ) : null}
        {typeMembers === "past" && !clubid.includes("allclubs") ? (
          <Grid container item>
            <Grid container item>
              <Typography
                variant="subtitle2"
                textTransform="uppercase"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Period of Members to Include
              </Typography>
            </Grid>
            <Grid container item direction="row" xs={12} spacing={1} pt={1}>
              <Grid item xs={6}>
                <Controller
                  name="dateRolesStart"
                  control={control}
                  rules={{
                    required: "Start year is required",
                  }}
                  render={({
                    field: { value, ...rest },
                    fieldState: { error, invalid },
                  }) => (
                    <DatePicker
                      label="Start Period"
                      slotProps={{
                        textField: {
                          error: invalid,
                          helperText: error?.message,
                        },
                      }}
                      views={["year"]}
                      openTo="year"
                      value={value}
                      maxDate={dayjs(new Date())}
                      disableFuture={true}
                      sx={{ width: "100%" }}
                      {...rest}
                    />
                  )}
                ></Controller>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="dateRolesEnd"
                  control={control}
                  rules={{
                    required: "End year is required",
                  }}
                  disabled={!dateRolesStart}
                  render={({
                    field: { value, ...rest },
                    fieldState: { error, invalid },
                  }) => (
                    <DatePicker
                      label="End Period"
                      slotProps={{
                        textField: {
                          error: invalid,
                          helperText: error?.message,
                        },
                      }}
                      views={["year"]}
                      openTo="year"
                      value={value}
                      maxDate={dayjs.min(
                        dayjs(new Date()),
                        dayjs(dateRolesStart).add(4, "year"),
                      )}
                      minDate={dateRolesStart}
                      disableFuture={true}
                      sx={{ width: "100%" }}
                      {...rest}
                    />
                  )}
                ></Controller>
              </Grid>
            </Grid>
          </Grid>
        ) : null}
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            Batches to Include
          </Typography>
          <Controller
            name="batchFiltering"
            control={control}
            rules={{ required: "Select at least one field!" }}
            render={({ field, fieldState: { error } }) => (
              <FormControl component="fieldset" fullWidth error={error}>
                <FormGroup row>
                  {[
                    { fieldValue: "allBatches", fieldName: "All" },
                    ...batches.map((batch) => ({
                      fieldValue: batch[2] + batch[3], //This is the numerical value of the batch eg. 2k20 -> 20
                      fieldName: batch,
                    })),
                  ].map(({ fieldValue, fieldName }) => (
                    <Grid item lg={1} md={3} sm={4} xs={6} key={fieldValue}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            value={fieldValue}
                            checked={
                              field.value.includes(fieldValue) ||
                              field.value.includes("allBatches") //If allBatches is selected, all the batches must be selected
                            }
                            disabled={
                              field.value.includes("allBatches") &&
                              fieldValue !== "allBatches"
                            }
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
                </FormGroup>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
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
                      { fieldValue: "clubid", fieldName: "Club Name" },
                      { fieldValue: "uid", fieldName: "Member Name" },
                      { fieldValue: "rollno", fieldName: "Roll No" },
                      { fieldValue: "batch", fieldName: "Batch" },
                      { fieldValue: "email", fieldName: "Email" },
                      {
                        fieldValue: "partofclub",
                        fieldName: "Is Currently Part of Club",
                      },
                      { fieldValue: "roles", fieldName: "Roles" },
                      { fieldValue: "poc", fieldName: "Is POC" },
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
