"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useAuth } from "components/AuthProvider";
import ConfirmDialog from "components/ConfirmDialog";
import FileUpload from "components/FileUpload";
import { useToast } from "components/Toast";
import { uploadImageFile } from "utils/files";

import { getActiveClubIds } from "actions/clubs/ids/server_action";
import { createInventoryItemAction } from "actions/inventory/items/create/server_action";
import { editInventoryItemAction } from "actions/inventory/items/edit/server_action";

const admin_roles = ["cc", "slo"];

const photo_maxSizeMB = 10;
const photo_warnSizeMB = 1;

export default function ItemForm({
  id = null,
  defaultValues = {},
  action = "create",
}) {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [mobileDialog, setMobileDialog] = useState(isMobile);

  const { triggerToast } = useToast();

  // fetch list of clubs (used by admin roles to pick owner)
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await getActiveClubIds();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setClubs(res.data);
      }
    })();
  }, []);

  const formDefaultValues = useMemo(
    () => ({
      iid: defaultValues?.iid ?? "",
      name: defaultValues?.name ?? "",
      brand: defaultValues?.brand ?? "",
      otherDetails: defaultValues?.otherDetails ?? defaultValues?.description ?? "",
      warrantyDetails: defaultValues?.warrantyDetails ?? "",
      clubid: defaultValues?.clubid || "slo",
      totalQty: defaultValues?.totalQty ?? defaultValues?.total_qty ?? defaultValues?.quantity ?? 1,
      availableQty: defaultValues?.availableQty ?? defaultValues?.available_qty ?? defaultValues?.quantity ?? 1,
      currentLocation: defaultValues?.currentLocation ?? defaultValues?.current_location ?? [],
      requiresApproval: defaultValues?.requiresApproval ?? true,
      photo: defaultValues?.photo ?? null,
    }),
    [defaultValues],
  );

  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  const submitHandlers = {
    create: async (data, opts) => {
      const res = await createInventoryItemAction(data);
      if (res.ok) {
        const isDraft = opts?.saveAsDraft;
        triggerToast({
          title: "Success!",
          messages: [
            admin_roles.includes(user?.role)
              ? "Item added to inventory."
              : isDraft
                ? "Item saved as draft."
                : "Item submitted for approval.",
          ],
          severity: "success",
        });
        router.push("/manage/inventory/recent");
      } else {
        triggerToast({ ...res.error, severity: "error" });
        setLoading(false);
      }
    },
    edit: async (data, opts) => {
      const res = await editInventoryItemAction(data);
      if (res.ok) {
        triggerToast({
          title: "Success!",
          messages: ["Item updated."],
          severity: "success",
        });
        router.push(`/manage/inventory/items/${res.data.iid || res.data._id}`);
      } else {
        triggerToast({ ...res.error, severity: "error" });
        setLoading(false);
      }
    },
  };

  async function onSubmit(formData, opts) {
    setLoading(true);

    const data = {
      iid: formData.iid.trim(),
      name: formData.name,
      totalQty: parseInt(formData.totalQty || 1, 10),
      availableQty: parseInt(formData.availableQty || 1, 10),
      netQty: parseInt(formData.availableQty || 1, 10),
      brand: formData.brand,
      otherDetails: formData.otherDetails || null,
      warrantyDetails: formData.warrantyDetails || null,
      currentLocation: formData.currentLocation || [],
      requiresApproval: true,
    };

    // owner club
    if (user?.role === "club") {
      data.clubid = user?.uid;
    } else if (admin_roles.includes(user?.role)) {
      data.clubid = formData.clubid;
    }

    // upload photo
    try {
      const photo_filename = (
        "item_photo_" +
        data.name +
        "_" +
        data.clubid
      ).replace(".", "_");

      if (typeof formData.photo === "string") {
        data.photo = formData.photo;
      } else if (Array.isArray(formData.photo) && formData.photo.length > 0) {
        data.photo = await uploadImageFile(
          formData.photo[0],
          photo_filename,
          photo_warnSizeMB,
        );
      } else {
        data.photo = null;
      }
    } catch (error) {
      triggerToast({
        title: "Error uploading photo",
        messages: error.message ? [error.message] : ["Failed to upload photo"],
        severity: "error",
      });
      setLoading(false);
      return;
    }

    await submitHandlers[action](data, opts);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
        {/*left side */}
        <Grid
          container
          spacing={2}
          size={{ xs: 12, md: 7, xl: 8 }}
        >
          <Grid container>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 2,
              }}
            >
              Item Details
            </Typography>

            <Grid container spacing={2}>
              {/* club owner selector – only visible to admins */}
              {admin_roles.includes(user?.role) ? (
                <Grid size={12}>
                  <ItemClubSelect control={control} clubs={clubs} />
                </Grid>
              ) : null}

              {/* asset code */}
              <Grid size={12}>
                <ItemCodeInput control={control} />
              </Grid>

              {/* name */}
              <Grid size={12}>
                <ItemNameInput control={control} />
              </Grid>

              {/* total qty + available qty + brand */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <ItemTotalQuantityInput control={control} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <ItemAvailableQuantityInput control={control} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <ItemBrandInput control={control} />
              </Grid>

              <Grid size={12}>
                <ItemLocationInput control={control} />
              </Grid>

              {/* description */}
              <Grid size={12}>
                <ItemDescriptionInput control={control} />
              </Grid>

              {/* warranty (optional) */}
              <Grid size={12}>
                <ItemWarrantyInput control={control} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/*right side*/}
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "flex-start" }}
          size={{ xs: "grow", md: "grow" }}
        >
          {/* photo */}
          <Grid container>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              Photo
            </Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FileUpload
                  type="image"
                  name="photo"
                  label="Item Photo"
                  control={control}
                  maxFiles={1}
                  maxSizeMB={photo_maxSizeMB}
                  shape="square"
                  warnSizeMB={photo_warnSizeMB}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* action buttons */}
          <Grid
            container
            direction="row"
            spacing={1}
            sx={{ pt: 3 }}
            size={12}
          >
            {admin_roles.includes(user?.role) ? (
              <>
                <Grid size={6}>
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
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
                <Grid size={6}>
                  <SubmitButton
                    mode="submit"
                    loading={loading}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    user={user}
                    admin_roles={admin_roles}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid size={6}>
                  <Button
                    size="large"
                    variant="outlined"
                    color="primary"
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
                <Grid size={6}>
                  <SubmitButton
                    mode="draft"
                    loading={loading}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    user={user}
                    admin_roles={admin_roles}
                  />
                </Grid>
                <Grid size={12}>
                  <SubmitButton
                    mode="submit"
                    loading={loading}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    user={user}
                    admin_roles={admin_roles}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* mobile warning */}
      <ConfirmDialog
        open={mobileDialog}
        title="Mobile View"
        description="This form is not optimized for mobile view. Please use a desktop device for a better experience."
        onConfirm={() => router.back()}
        onClose={() => setMobileDialog(false)}
        confirmProps={{ color: "primary" }}
        confirmText="Go Back"
        cancelText="Continue"
      />
    </form>
  );
}

// ── SubmitButton ──────────────────────────────────────────────────────────────

function SubmitButton({
  mode = "draft",
  loading,
  handleSubmit,
  onSubmit,
  defaultValues = {},
  user = {},
  admin_roles = [],
}) {
  const isAdmin = admin_roles.includes(user?.role);

  // For admins, collapse draft + submit into a single "Save" button
  // shown in the "submit" slot; draft slot is hidden.
  if (mode === "draft" && isAdmin) return null;

  const label =
    mode === "submit"
      ? isAdmin
        ? "Save"
        : "Submit for Approval"
      : "Save as Draft";

  const variant = mode === "submit" ? "contained" : "outlined";

  return (
    <Tooltip title="">
      <span>
        <Button
          loading={loading}
          type={mode === "draft" ? "submit" : undefined}
          onClick={
            mode === "submit"
              ? () =>
                  handleSubmit((data) =>
                    onSubmit(data, { saveAsDraft: false }),
                  )()
              : undefined
          }
          size="large"
          variant={variant}
          color="primary"
          fullWidth
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
}


function ItemClubSelect({ control, clubs = [] }) {
  return (
    <Controller
      name="clubid"
      control={control}
      rules={{ required: "Select a club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="clubid">Owner Club *</InputLabel>
          <Select
            labelId="clubid"
            label="Owner Club *"
            fullWidth
            {...field}
            value={field.value ?? "slo"}
          >
            {clubs
              ?.slice()
              ?.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
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

function ItemCodeInput({ control }) {
  return (
    <Controller
      name="iid"
      control={control}
      rules={{ required: "Asset code is required!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Asset Code"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          required
          onBlur={(event) => field.onChange(event.target.value.trim())}
        />
      )}
    />
  );
}

function ItemLocationInput({ control }) {
  const locations = [
    ["amphi", "Amphitheater Storage Room"],
    ["vindhya", "Vindhya Storage Room"],
    ["himalaya", "Himalaya Storage Room"],
    ["music_room", "Music Room"],
    ["astro_lab", "Astro Lab"],
    ["other", "Other"],
  ];

  return (
    <Controller
      name="currentLocation"
      control={control}
      rules={{ required: "Select at least one location!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="item-location-label">Current Location *</InputLabel>
          <Select
            {...field}
            multiple
            labelId="item-location-label"
            label="Current Location *"
            value={field.value || []}
          >
            {locations.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

function ItemNameInput({ control }) {
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: "Item name is required!",
        minLength: {
          value: 2,
          message: "Item name must be at least 2 characters long!",
        },
        maxLength: {
          value: 150,
          message: "Item name must be at most 150 characters long!",
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
          onBlur={(e) => field.onChange(e?.target?.value.trim())}
        />
      )}
    />
  );
}

function ItemTotalQuantityInput({ control }) {
  return (
    <Controller
      name="totalQty"
      control={control}
      rules={{
        required: "Total quantity is required!",
        min: { value: 0, message: "Total quantity must be at least 0!" },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          type="number"
          label="Total Quantity"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          required
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
      )}
    />
  );
}

function ItemAvailableQuantityInput({ control }) {
  return (
    <Controller
      name="availableQty"
      control={control}
      rules={{
        required: "Available quantity is required!",
        min: { value: 0, message: "Available quantity must be at least 0!" },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          type="number"
          label="Available Quantity"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          required
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
      )}
    />
  );
}

function ItemBrandInput({ control }) {
  return (
    <Controller
      name="brand"
      control={control}
      rules={{
        maxLength: {
          value: 100,
          message: "Brand name must be at most 100 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Brand"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          onBlur={(e) => field.onChange(e?.target?.value.trim())}
        />
      )}
    />
  );
}

function ItemDescriptionInput({ control }) {
  return (
    <Controller
      name="otherDetails"
      control={control}
      rules={{
        maxLength: {
          value: 2000,
          message: "Description must be at most 2000 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Other Details"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          rows={6}
          fullWidth
          multiline
          onBlur={(e) =>
            field.onChange(
              e?.target?.value.replace(/^[\s\n\t]+|[\s\n\t]+$/g, ""),
            )
          }
        />
      )}
    />
  );
}

function ItemWarrantyInput({ control }) {
  return (
    <Controller
      name="warrantyDetails"
      control={control}
      rules={{
        maxLength: {
          value: 500,
          message: "Warranty details must be at most 500 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Warranty Details (optional)"
          autoComplete="off"
          error={invalid}
          helperText={
            error?.message ||
            "e.g. 2-year manufacturer warranty, expires Jan 2027"
          }
          variant="outlined"
          rows={3}
          fullWidth
          multiline
          onBlur={(e) =>
            field.onChange(
              e?.target?.value.replace(/^[\s\n\t]+|[\s\n\t]+$/g, ""),
            )
          }
        />
      )}
    />
  );
}
