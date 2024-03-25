"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
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
  const [values, setValues] = useState({
    teams: [],
    whyCc: "",
    whyThisPosition: "",
    designExperience: "",
  });
  const [phone, setPhone] = useState(user.phone || "");
  const { control, handleSubmit, watch } = useForm({ defaultValues });
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { mutate } = useAuth(); // Assuming `useAuth` returns a function for mutations

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const { triggerToast } = useToast();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSend = async () => {
    setLoading(true);

    const phoneData = {
      uid: user.uid,
      phone: phone,
    };
    let res = await fetch("/actions/users/save", {
      method: "POST",
      body: JSON.stringify({ userDataInput: phoneData }),
    });

    res = await res.json();
    try {
      await mutate({
        mutation: APPLY_FOR_CC,
        variables: values,
      });
      setSent(true);
      triggerToast({
        title: "Success!",
        messages: ["Form Sent."],
        severity: "success",
      });
    } catch (error) {
      triggerToast({
        title: "Error!",
        messages: ["Failed to send form."],
        severity: "error",
      });
      // console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sent) {
      setTimeout(() => {
        router.push("/cc-recruitments");
      }, 1000);
    }
  }, [sent]);

  return (
    <form onSubmit={handleSubmit(handleSend)}>
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
                {user.phone ? (
                  <TextField
                    label="Phone number"
                    variant="outlined"
                    value={phone || "Unknown"}
                    fullWidth
                    required
                    disabled
                    va
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
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error} // Use !! to convert error to a boolean
                        helperText={error?.message}
                        label="Phone Number"
                        variant="outlined"
                        onChange={(e) => {
                          setPhone(e.target.value);
                          field.onChange(e);
                        }}
                        fullWidth
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={12} xl={12}>
                <FormControl fullWidth>
                  <InputLabel id="teams-label">Teams</InputLabel>
                  <Select
                    labelId="teams-label"
                    id="teams"
                    multiple
                    value={values.teams} // Ensure values.teams is always an array
                    onChange={handleChange("teams")}
                    fullWidth
                    input={<OutlinedInput />}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {Array.isArray(selected) ? (
                          selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))
                        ) : (
                          <Chip key={selected} label={selected} />
                        )}
                      </Box>
                    )}
                  >
                    {availableTeams.map((team) => (
                      <MenuItem key={team} value={team.toLowerCase()}>
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select the teams you are interested in joining.
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* Add form validation error handling for other fields here */}
              <Grid item xs={12} md={12} xl={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Why do you want to join CC?"
                  value={values.whyCc}
                  onChange={handleChange("whyCc")}
                  // Add error handling here if needed using control.formState.errors.whyCc?.message
                />
              </Grid>
              <Grid item xs={12} md={12} xl={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Why do you want to join this position?"
                  value={values.whyThisPosition}
                  onChange={handleChange("whyThisPosition")}
                  // Add error handling here if needed using control.formState.errors.whyThisPosition?.message
                />
              </Grid>
              <Grid item xs={12} md={12} xl={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Design experience"
                  value={values.designExperience}
                  onChange={handleChange("designExperience")}
                  // Add error handling here if needed using control.formState.errors.designExperience?.message
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
                    handleSend(data, { shouldSubmit: true })
                  )()
                }
              >
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
