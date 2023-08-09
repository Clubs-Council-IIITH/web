"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";

import { LoadingButton } from "@mui/lab";
import { Button, Grid, TextField, Typography } from "@mui/material";

import FileUpload from "components/FileUpload";
import ConfirmDialog from "components/ConfirmDialog";

import { uploadFile } from "utils/files";

export default function UserForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const { control, handleSubmit } = useForm({ defaultValues });
  const { triggerToast } = useToast();

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
    save: async (data) => {
      let res = await fetch("/actions/users/save", {
        method: "POST",
        body: JSON.stringify({ userDataInput: data }),
      });
      res = await res.json();

      if (res.ok) {
        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Profile saved."],
          severity: "success",
        });
        router.push(`/profile/${defaultValues.uid}`);
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
      uid: defaultValues.uid,
      phone: formData.phone,
    };

    // upload image
    data.img =
      typeof formData.img === "string"
        ? formData.img
        : Array.isArray(formData.img) && formData.img.length > 0
        ? await uploadFile(formData.img[0], "image")
        : null;

    // mutate
    await submitHandlers[action](data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid
          container
          item
          xs={12}
          md={7}
          xl={8}
          spacing={3}
          alignItems="flex-start"
        >
          <Grid container item>
            <Grid container item spacing={2} mt={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  disabled
                  label="First Name"
                  value={defaultValues?.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  disabled
                  label="Last Name"
                  value={defaultValues?.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="Email"
                  value={defaultValues?.email}
                />
              </Grid>
              <Grid container item xs={12} spacing={1}>
                <Grid item>
                  <TextField
                    disabled
                    label="Batch"
                    value={defaultValues?.batch?.toUpperCase()}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    disabled
                    label="Stream"
                    value={defaultValues?.stream?.toUpperCase()}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item>
            <Typography
              variant="subtitle2"
              textTransform="uppercase"
              color="text.secondary"
              gutterBottom
              mb={defaultValues?.phone ? 2 : 1}
            >
              Details
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    pattern: {
                      value:
                        /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g,
                      message: "Invalid phone number!",
                    },
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
              Media
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <FileUpload
                  type="image"
                  name="img"
                  label="Profile Image"
                  control={control}
                  maxFiles={1}
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
