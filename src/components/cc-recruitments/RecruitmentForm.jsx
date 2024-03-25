"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "components/Toast";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  OutlinedInput,
  FormControl,
  Chip,
  Box,
  InputLabel,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";

import UserImage from "components/users/UserImage";
import ConfirmDialog from "components/ConfirmDialog";

const availableTeams = ["Design", "Finance", "Logistics", "Stratetgy"];

function MemberUserInput({ user = {} }) {
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
        <Typography variant="h4">
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
    <Typography>Please Login to apply</Typography>
  );
}

export default function RecruitmentForm({ user = {} }) {
  const defaultValues = {};
  const { control, handleSubmit, watch } = useForm({ defaultValues });
  const teams = watch("teams");

  const [loading, setLoading] = useState(false);
  const [submiited, setSubmitted] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const { triggerToast } = useToast();

  async function onSubmit(formData) {
    setLoading(true);
    if (!user.phone && formData.phone) {
      const phoneData = {
        uid: user.uid,
        phone: formData.phone,
      };
      let res = await fetch("/actions/users/save/phone", {
        method: "POST",
        body: JSON.stringify({ userDataInput: phoneData }),
      });
      res = await res.json();

      if (!res.ok) {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });
      }
    }

    const data = {
      uid: user.uid,
      email: user.email,
      teams: formData.teams,
      whyCc: formData.whyCc,
      whyThisPosition: formData.whyThisPosition,
      designExperience: formData?.designExperience || null,
    };

    let res = await fetch("/actions/cc-recruitments/apply", {
      method: "POST",
      body: JSON.stringify({ ccRecruitmentInput: data }),
    });
    res = await res.json();

    if (res.ok) {
      triggerToast({
        severity: "success",
        message: "Application submitted successfully!",
      });
      setSubmitted(true);
    } else {
      triggerToast({
        severity: "error",
        message: "Failed to submit application!",
      });
    }

    setLoading(false);
  }

  return (
    <>
      {submiited ? (
        <Typography variant="h5" gutterBottom mt={6} align="center">
          Thanks for applying for Clubs Council Position. You will be notified
          about the further stages soon.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid container item xs={12} md={12} xl={12} spacing={3}>
              <Grid container item>
                <Typography
                  variant="subtitle2"
                  textTransform="uppercase"
                  color="text.secondary"
                  gutterBottom
                  mb={2}
                >
                  User Details
                </Typography>
                <Grid container item spacing={4}>
                  <Grid item xs={12} md={12} xl={12}>
                    <MemberUserInput user={user} />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      label="Roll No"
                      variant="outlined"
                      value={user.rollno || "Unknown"}
                      fullWidth
                      required
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      label="Batch"
                      variant="outlined"
                      value={user.batch.toUpperCase() || "Unknown"}
                      fullWidth
                      required
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <TextField
                      label="Stream"
                      variant="outlined"
                      value={user.stream.toUpperCase() || "Unknown"}
                      fullWidth
                      required
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    {user?.phone ? (
                      <TextField
                        label="Phone number"
                        variant="outlined"
                        value={user.phone || "Unknown"}
                        fullWidth
                        required
                        disabled
                      />
                    ) : (
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          validate: {
                            checkPhoneNumber: (value) => {
                              if (!value || value === "") return true;
                              try {
                                const phoneNumber = parsePhoneNumberWithError(
                                  value,
                                  {
                                    defaultCountry: "IN",
                                  }
                                );
                                return (
                                  isValidPhoneNumber(value, "IN") ||
                                  "Invalid Phone Number!"
                                );
                              } catch (error) {
                                return error.message;
                              }
                            },
                          },
                          required: "Phone number is required!",
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
                  mb={2}
                >
                  Team Specific Details
                </Typography>
                <Grid container item spacing={4}>
                  <Grid item xs={12} md={12} xl={12}>
                    <Controller
                      name="teams"
                      control={control}
                      defaultValue={[]}
                      rules={{
                        validate: {
                          checkTeams: (value) =>
                            value.length > 0 || "Select at least one team!",
                        },
                      }}
                      render={({ field, fieldState: { error, invalid } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="teams-label">Teams</InputLabel>
                          <Select
                            multiple
                            id="teams"
                            labelId="teams-label"
                            input={<OutlinedInput label="teams" />}
                            error={invalid}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            {...field}
                          >
                            {availableTeams
                              ?.slice()
                              ?.sort()
                              ?.map((team) => (
                                <MenuItem key={team} value={team}>
                                  {team}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText error={invalid}>
                            {error?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <Controller
                      name="whyThisPosition"
                      control={control}
                      rules={{
                        required: "Need to provide a reason!",
                        maxLength: {
                          value: 4000,
                          message: "Must be at most 4000 characters long!",
                        },
                      }}
                      render={({ field, fieldState: { error, invalid } }) => (
                        <TextField
                          {...field}
                          label="Why do you want to join this position?"
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
                  Other Details
                </Typography>
                <Grid container item spacing={4}>
                  <Grid item xs={12} md={12} xl={12}>
                    <Controller
                      name="whyCc"
                      control={control}
                      rules={{
                        required: "Need to provide a reason!",
                        maxLength: {
                          value: 4000,
                          message: "Must be at most 4000 characters long!",
                        },
                      }}
                      render={({ field, fieldState: { error, invalid } }) => (
                        <TextField
                          {...field}
                          label="Why do you want to join CC?"
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
                  </Grid>
                  {teams?.includes("design") && (
                    <Grid item xs={12} md={12} xl={12}>
                      <Controller
                        name="designExperience"
                        control={control}
                        rules={{
                          required: "This field is required for Design Team!",
                          maxLength: {
                            value: 4000,
                            message: "Must be at most 4000 characters long!",
                          },
                        }}
                        render={({ field, fieldState: { error, invalid } }) => (
                          <TextField
                            {...field}
                            label="Design experience"
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
                    </Grid>
                  )}
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
                  onConfirm={() => location.reload()}
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
                  onClick={() =>
                    handleSubmit((data) =>
                      onSubmit(data, { shouldSubmit: true })
                    )()
                  }
                >
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
}
