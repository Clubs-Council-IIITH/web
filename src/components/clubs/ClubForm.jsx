"use client";

import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";

import { useToast } from "components/Toast";

import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Icon from "components/Icon";
import FileUpload from "components/FileUpload";

import { uploadFile } from "utils/files";

export default function ClubForm({ defaultValues = {}, action = "log" }) {
  const router = useRouter();

  const { control, handleSubmit } = useForm({ defaultValues });
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
        router.push("/manage/clubs");
      } else {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });
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
        router.push("/manage/clubs");
      } else {
        // show error toast
        triggerToast({
          ...res.error,
          severity: "error",
        });
      }
    },
  };

  // transform data and mutate
  async function onSubmit(formData) {
    const data = {
      code: formData.code,
      name: formData.name,
      email: formData.email,
      category: formData.category,
      tagline: formData.tagline,
      description: formData.description,
      socials: {
        website: formData.website,
        instagram: formData.instagram,
        facebook: formData.facebook,
        youtube: formData.youtube,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        discord: formData.discord,
      },
    };

    // set CID based on club email
    data.cid = formData.email.split("@")[0];

    // upload media
    data.logo = formData?.logo?.[0]
      ? await uploadFile(formData?.logo?.[0], "image")
      : null;
    data.banner = formData?.banner?.[0]
      ? await uploadFile(formData?.banner?.[0], "image")
      : null;

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
                <ClubCategorySelect control={control} />
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
            error?.message || "A custom, short code to identify this club."
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
function ClubNameInput({ control }) {
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
          type="email"
          label="Email"
          autoComplete="off"
          variant="outlined"
          fullWidth
          required
        />
      )}
    />
  );
}

// club category dropdown
function ClubCategorySelect({ control }) {
  return (
    <Controller
      name="category"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="category">Category *</InputLabel>
          <Select labelId="category" label="Category *" fullWidth {...field}>
            <MenuItem value="cultural">Cultural</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
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
          required
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
          autoComplete="off"
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
