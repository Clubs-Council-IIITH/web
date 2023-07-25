"use client";

import { useForm, Controller } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import Icon from "components/Icon";
import FileUpload from "components/FileUpload";

export default function ClubForm({
  defaultValues = {},
  onSubmit = console.log,
}) {
  const { control, handleSubmit } = useForm({ defaultValues });

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
            >
              Details
            </Typography>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <ClubCodeInput control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubNameInput control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubEmailInput control={control} />
              </Grid>
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
                <ClubSocialInput name="youtube" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="twitter" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="linkedin" control={control} />
              </Grid>
              <Grid item xs={12}>
                <ClubSocialInput name="discord" control={control} />
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
      </Grid>
    </form>
  );
}

// custom club code input
function ClubCodeInput({ control }) {
  return (
    <Controller
      name="cid"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          error={error}
          label="Club Code"
          helperText="A custom, short code to identify this club."
          variant="outlined"
          fullWidth
          required
        />
      )}
    />
  );
}

// club name input
function ClubNameInput({ control }) {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Name"
          variant="outlined"
          fullWidth
          required
        />
      )}
    />
  );
}

// club email input
function ClubEmailInput({ control }) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="Email"
          variant="outlined"
          fullWidth
          required
        />
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
      render={({ field }) => (
        <TextField {...field} label="Tagline" variant="outlined" fullWidth />
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
      render={({ field }) => (
        <TextField
          {...field}
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
        />
      )}
    />
  );
}

// club social link input
function ClubSocialInput({ name, control }) {
  const attributeMap = {
    website: { label: "Website", icon: "mdi:web" },
    instagram: { label: "Instagram", icon: "mdi:instagram" },
    facebook: { label: "Facebook", icon: "ic:baseline-facebook" },
    youtube: { label: "YouTube", icon: "mdi:youtube" },
    twitter: { label: "Twitter", icon: "mdi:twitter" },
    linkedin: { label: "LinkedIn", icon: "mdi:linkedin" },
    discord: { label: "Discord", icon: "ic:baseline-discord" },
  };

  return (
    <Controller
      name={`socials.${name}`}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={attributeMap[name].label}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon external variant={attributeMap[name].icon} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
