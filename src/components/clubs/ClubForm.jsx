"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { useMode } from "contexts/ModeContext";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  FormControl,
  FormGroup,
  FormControlLabel,
  InputLabel,
  Select,
  Switch,
  MenuItem,
} from "@mui/material";

import Icon from "components/Icon";
import FileUpload from "components/FileUpload";
import ConfirmDialog from "components/ConfirmDialog";

import { uploadFile } from "utils/files";
import { socialsData } from "utils/socialsData";

export default function ClubForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const { control, handleSubmit, watch } = useForm({ defaultValues });
  const { triggerToast } = useToast();

  // different form submission handlers
  const submitHandlers = {
    log: console.log,
    create: async (data) => {
      let res = await fetch("/actions/clubs/create", {
        method: "POST",
        body: JSON.stringify({ clubInput: data }),
      });
      res = await res.json();

      if (res.ok) {
        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Club created."],
          severity: "success",
        });
        router.push(`/manage/clubs/${data.cid}`);
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
    edit: async (data) => {
      let res = await fetch("/actions/clubs/edit", {
        method: "POST",
        body: JSON.stringify({ clubInput: data, cid: data.cid }),
      });
      res = await res.json();

      if (res.ok) {
        // show success toast & redirect to manage page
        triggerToast({
          title: "Success!",
          messages: ["Club edited."],
          severity: "success",
        });
        router.push(`/manage/clubs/${data.cid}`);
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
      code: formData.code,
      name: formData.name,
      email: formData.email,
      category: formData.category,
      tagline: formData.tagline === "" ? null : formData.tagline,
      description: formData.description,
      studentBody: formData.studentBody,
      socials: {
        website:
          formData.socials.website === "" ? null : formData.socials.website,
        instagram:
          formData.socials.instagram === "" ? null : formData.socials.instagram,
        facebook:
          formData.socials.facebook === "" ? null : formData.socials.facebook,
        youtube:
          formData.socials.youtube === "" ? null : formData.socials.youtube,
        twitter:
          formData.socials.twitter === "" ? null : formData.socials.twitter,
        linkedin:
          formData.socials.linkedin === "" ? null : formData.socials.linkedin,
        discord:
          formData.socials.discord === "" ? null : formData.socials.discord,
        whatsapp:
          formData.socials.whatsapp === "" ? null : formData.socials.whatsapp,
      },
    };

    // set CID based on club email
    // Special case for Clubs Council
    data.cid =
      formData.email === "clubs@iiit.ac.in"
        ? "cc"
        : formData.email.split("@")[0];

    // upload media
    data.logo =
      typeof formData.logo === "string"
        ? formData.logo
        : Array.isArray(formData.logo) && formData.logo.length > 0
          ? await uploadFile(formData.logo[0], "image")
          : null;
    data.banner =
      typeof formData.banner === "string"
        ? formData.banner
        : Array.isArray(formData.banner) && formData.banner.length > 0
          ? await uploadFile(formData.banner[0], "image")
          : null;

    if (data.category !== "other") data.studentBody = false;

    // mutate
    await submitHandlers[action](data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
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
              {/* show club code input only when creating a new club */}
              {!defaultValues.cid ? (
                <Grid item xs={12}>
                  <ClubCodeInput control={control} />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <ClubNameInput
                  control={control}
                  disabled={user?.role != "cc"}
                />
              </Grid>
              <Grid item xs={12}>
                <ClubEmailInput
                  control={control}
                  disabled={user?.role != "cc"}
                />
              </Grid>
              <Grid item xs={12}>
                <ClubCategorySelect
                  control={control}
                  disabled={user?.role != "cc"}
                />
              </Grid>
              {watch("category") == "other" ? (
                <Grid item xs={12}>
                  <StudentBodySelect
                    control={control}
                    disabled={
                      user?.role != "cc" || watch("category") != "other"
                    }
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <ClubTaglineInput control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubDescriptionInput control={control} />
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
              Socials
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <ClubSocialInput name="website" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="instagram" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="facebook" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="twitter" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="linkedin" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="youtube" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="discord" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="whatsapp" control={control} />
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
                  name="logo"
                  label="Logo"
                  control={control}
                  maxFiles={1}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUpload
                  type="image"
                  name="banner"
                  label="Banner"
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

// custom club code input
function ClubCodeInput({ control }) {
  return (
    <Controller
      name="code"
      control={control}
      rules={{
        maxLength: {
          value: 15,
          message: "Club code must be at most 15 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Club Code"
          autoComplete="off"
          error={invalid}
          helperText={
            error?.message ||
            "A custom, short code to identify this club. NOTE: This can NOT be changed."
          }
          variant="outlined"
          fullWidth
          required
        />
      )}
    />
  );
}

// club name input
function ClubNameInput({ control, disabled }) {
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        minLength: {
          value: 5,
          message: "Club name must be at least 5 characters long!",
        },
        maxLength: {
          value: 50,
          message: "Club name must be at most 50 characters long!",
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
          disabled={disabled}
          required
        />
      )}
    />
  );
}

// club email input
function ClubEmailInput({ control, disabled }) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          type="email"
          label="Email"
          autoComplete="off"
          variant="outlined"
          fullWidth
          disabled={disabled}
          required
        />
      )}
    />
  );
}

// club category dropdown
function ClubCategorySelect({ control, disabled }) {
  return (
    <Controller
      name="category"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="category">Category *</InputLabel>
          <Select
            labelId="category"
            label="Category *"
            fullWidth
            disabled={disabled}
            {...field}
          >
            <MenuItem value="cultural">Cultural</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="affinity">Affinity Group</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
}

// student body select
function StudentBodySelect({ control, disabled }) {
  return (
    <Controller
      name="studentBody"
      control={control}
      render={({ field }) => (
        <FormGroup row>
          <FormControlLabel
            value="left"
            control={
              <Switch
                color="primary"
                checked={field.value}
                {...field}
                disabled={disabled}
              />
            }
            label="Student Body"
            labelPlacement="left"
          />
        </FormGroup>
      )}
    />
  );
}

// club tagline input
function ClubTaglineInput({ control }) {
  return (
    <Controller
      name="tagline"
      control={control}
      rules={{
        minLength: {
          value: 2,
          message: "Club tagline must be at least 2 characters long!",
        },
        maxLength: {
          value: 200,
          message: "Club tagline must be at most 200 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Tagline"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}

// club description input
function ClubDescriptionInput({ control }) {
  return (
    <Controller
      name="description"
      control={control}
      rules={{
        maxLength: {
          value: 1000,
          message: "Club description must be at most 1000 characters long!",
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

// club social link input
function ClubSocialInput({ name, control }) {
  const { isDark } = useMode();

  return (
    <Controller
      name={`socials.${name}`}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return true;

          // Match regex
          if (
            socialsData[name].regex &&
            !new RegExp(socialsData[name].regex).test(value)
          )
            return `Invalid ${socialsData[name].label} URL`;

          // Check if URL contains validation string
          if (
            socialsData[name].validation &&
            !value.includes(socialsData[name].validation)
          )
            return `Invalid ${socialsData[name].label} Ualdiation`;

          return true;
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          type="url"
          label={socialsData[name].label}
          autoComplete="off"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon
                  external
                  variant={socialsData[name].icon}
                  sx={{
                    color: isDark
                      ? socialsData[name].darkcolor
                      : socialsData[name].color,
                    marginRight: 1,
                  }}
                />
              </InputAdornment>
            ),
          }}
          error={invalid}
          helperText={error?.message}
        />
      )}
    />
  );
}
