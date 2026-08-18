"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useAuth } from "components/AuthProvider";
import ConfirmDialog from "components/ConfirmDialog";
import { useToast } from "components/Toast";
import { ISOtoHuman } from "utils/formatTime";

import { createTransactionAction } from "actions/inventory/transactions/create/server_action";
import { submitTransactionAction } from "actions/inventory/transactions/submit/server_action";

export default function TransactionForm({
  defaultValues = {},
  items = [],
  events = [],
  pocs = [],
  existingTransactions = [],
  onSubmit,
  submitLabel = "Submit Request",
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const normalizedDefaults = useMemo(
    () => ({
      itemid: defaultValues?.itemid ?? "",
      quantity: defaultValues?.quantity ?? 1,
      startDate: defaultValues?.startDate ?? null,
      endDate: defaultValues?.endDate ?? null,
      useEvent: defaultValues?.useEvent ?? false,
      eventid: defaultValues?.eventid ?? "",
      purpose: defaultValues?.purpose ?? "",
      storageLocation: defaultValues?.storageLocation ?? "",
      poc: defaultValues?.poc ?? "",
      remarks: defaultValues?.remarks ?? "",
    }),
    [defaultValues],
  );

  const { control, handleSubmit, watch } = useForm({
    defaultValues: normalizedDefaults,
    mode: "onChange",
  });

  const useEvent = watch("useEvent");
  const selectedItemId = watch("itemid");
  const quantity = watch("quantity");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Resolved item object for the currently selected item
  const selectedItem = useMemo(
    () => items.find((i) => i._id === selectedItemId || i.iid === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  // net_qty = qty available for clubs to borrow at this time
  const netQty = selectedItem?.netQty ?? null;

  // Whether requested quantity exceeds available net_qty
  const qtyExceedsAvailable =
    netQty !== null && Number(quantity) > netQty;

  // Clashing transactions for the selected item
  const clashingTransactions = useMemo(() => {
    if (!selectedItemId || !existingTransactions.length) return [];
    return existingTransactions.filter((tx) => {
      const matchItem =
        tx.itemid === selectedItemId ||
        tx._id === selectedItemId;
      if (!matchItem) return false;
      const pendingOrActiveStates = [
        "incomplete",
        "pending",
        "pending_club",
        "pending_slo",
        "approved_slo",
        "borrowed",
      ];
      if (
        tx.status?.state &&
        !pendingOrActiveStates.includes(tx.status.state)
      ) {
        return false;
      }
      if (!startDate || !endDate) return true;
      const txStart = tx.startDate ? new Date(startDate) : null;
      const txEnd = tx.endDate ? new Date(endDate) : null;
      const reqStart = new Date(startDate);
      const reqEnd = new Date(endDate);
      if (txStart && txEnd) {
        return reqStart <= txEnd && reqEnd >= txStart;
      }
      return true;
    });
  }, [selectedItemId, startDate, endDate, existingTransactions]);

  const submit = async (formData) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
        return;
      }

      const item = items.find((i) => i._id === formData.itemid || i.iid === formData.itemid);
      const linkedEvent = events.find((e) => e._id === formData.eventid);

      const details = {
        itemid: item?.iid || item?._id || formData.itemid,
        itemName: item?.name || "",
        itemCode: item?.code || item?.iid || item?._id || "",
        itemClubid: item?.clubid || null,
        clubid: user?.uid || user?.club || item?.clubid || "slo",
        clubName: user?.name || null,
        quantity: parseInt(formData.quantity, 10),
        startDate: formData.startDate ? dayjs(formData.startDate).format("YYYY-MM-DD") : null,
        endDate: formData.endDate ? dayjs(formData.endDate).format("YYYY-MM-DD") : null,
        purpose: formData.useEvent ? (linkedEvent ? `For event: ${linkedEvent.name}` : "") : formData.purpose,
        eventid: formData.useEvent ? formData.eventid : null,
        eventName: formData.useEvent && linkedEvent ? linkedEvent.name : null,
        remarks: formData.remarks || null,
      };

      const createRes = await createTransactionAction(details);
      if (!createRes.ok) {
        triggerToast({
          title: createRes.error?.title || "Error creating transaction",
          messages: createRes.error?.messages || ["Failed to create transaction request."],
          severity: "error",
        });
        return;
      }

      const tid = createRes.data?.tid;
      if (tid) {
        const submitRes = await submitTransactionAction(tid);
        if (!submitRes.ok) {
          triggerToast({
            title: submitRes.error?.title || "Error submitting transaction",
            messages: submitRes.error?.messages || ["Transaction created as draft, but auto-submission failed."],
            severity: "warning",
          });
          router.push("/manage/inventory/transactions");
          return;
        }
      }

      triggerToast({
        title: "Success!",
        messages: ["Transaction request submitted successfully."],
        severity: "success",
      });
      router.push("/manage/inventory/transactions");
    } catch (err) {
      triggerToast({
        title: "Request Error",
        messages: [err.message || "An unexpected error occurred."],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
        {/* ── Left column: request details ─────────────────────────────── */}
        <Grid container spacing={2} size={{ xs: 12, md: 7, xl: 8 }}>

          {/* Section: Item */}
          <Grid container size={12}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ textTransform: "uppercase", color: "text.secondary", mb: 2 }}
            >
              Item
            </Typography>

            <Grid container spacing={2} size={12}>
              {/* item single-select */}
              <Grid size={12}>
                <Controller
                  name="itemid"
                  control={control}
                  rules={{ required: "Select an item!" }}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <FormControl fullWidth error={invalid}>
                      <InputLabel id="tran-item-label">Item *</InputLabel>
                      <Select
                        {...field}
                        labelId="tran-item-label"
                        label="Item *"
                      >
                        {items.map((item) => {
                          const qty = item.netQty ?? 0;
                          const outOfStock = qty <= 0;
                          return (
                            <MenuItem
                              key={item._id}
                              value={item._id}
                              disabled={outOfStock}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  gap: 1,
                                }}
                              >
                                <Box>
                                  <Typography variant="body2">
                                    {item.name}
                                  </Typography>
                                  {item.brand && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {item.brand}
                                    </Typography>
                                  )}
                                  <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    display="block"
                                  >
                                    Owner: {item.clubName || item.clubid || "SLO"}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={
                                    outOfStock
                                      ? "Out of stock"
                                      : `${qty} available`
                                  }
                                  size="small"
                                  color={outOfStock ? "default" : "success"}
                                  variant="outlined"
                                  sx={{ flexShrink: 0 }}
                                />
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {error && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.75 }}
                        >
                          {error.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* quantity */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: "Quantity is required!",
                    min: { value: 1, message: "Quantity must be at least 1!" },
                    validate: (v) => {
                      if (netQty !== null && Number(v) > netQty) {
                        return `Only ${netQty} unit${netQty === 1 ? "" : "s"} available!`;
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error, invalid } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Quantity"
                      type="number"
                      required
                      error={invalid}
                      helperText={
                        error?.message ??
                        (netQty !== null
                          ? `Max available: ${netQty}`
                          : undefined)
                      }
                      slotProps={{
                        input: {
                          inputProps: {
                            min: 1,
                            max: netQty ?? undefined,
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* out-of-stock / over-qty warning */}
          {selectedItem && qtyExceedsAvailable ? (
            <Grid size={12}>
              <Alert severity="error" variant="outlined">
                <AlertTitle>Quantity Unavailable</AlertTitle>
                Only <strong>{netQty}</strong> unit
                {netQty === 1 ? "" : "s"} of{" "}
                <strong>{selectedItem.name}</strong> are available for
                borrowing. Please reduce the quantity.
              </Alert>
            </Grid>
          ) : null}

          {/* clashing warning */}
          {clashingTransactions.length > 0 ? (
            <Grid size={12}>
              <Alert severity="warning" variant="outlined">
                <AlertTitle>Clashing Transaction Warning</AlertTitle>
                {clashingTransactions.length === 1 ? (
                  <>
                    <strong>{selectedItem?.name ?? selectedItemId}</strong> has
                    an active / pending transaction by{" "}
                    <strong>
                      {clashingTransactions[0].clubName ||
                        clashingTransactions[0].clubid}
                    </strong>
                    .
                  </>
                ) : (
                  <>
                    This item has {clashingTransactions.length} active or
                    pending transaction requests during this period.
                  </>
                )}
              </Alert>
            </Grid>
          ) : null}

          {/* Section: Borrow Period */}
          <Grid container size={12}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ textTransform: "uppercase", color: "text.secondary", mb: 2 }}
            >
              Borrow Period
            </Typography>

            <Grid container spacing={2} size={12}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: "Start date is required!",
                    validate: (val) => {
                      if (!val) return "Start date is required!";
                      if (dayjs(val).isBefore(dayjs().startOf("day"))) {
                        return "Start date must be today or in the future!";
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Start Date *"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                      }}
                      minDate={dayjs().startOf("day")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: "Return date is required!",
                    validate: (val) => {
                      if (!val) return "Return date is required!";
                      const startVal = startDate ? dayjs(startDate) : null;
                      if (startVal && dayjs(val).isBefore(startVal.startOf("day"))) {
                        return "Return date must be on or after start date!";
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Return By *"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        field.onChange(newValue ? newValue.format("YYYY-MM-DD") : null);
                      }}
                      minDate={startDate ? dayjs(startDate).startOf("day") : dayjs().startOf("day")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Section: Purpose */}
          <Grid container size={12}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ textTransform: "uppercase", color: "text.secondary", mb: 2 }}
            >
              Purpose
            </Typography>

            <Grid container spacing={2} size={12}>
              {/* link to event toggle */}
              <Grid size={12}>
                <Controller
                  name="useEvent"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Link this request to an event"
                    />
                  )}
                />
              </Grid>

              {/* event selector OR purpose textarea */}
              <Grid size={12}>
                {useEvent ? (
                  <Controller
                    name="eventid"
                    control={control}
                    rules={{ validate: (v) => !useEvent || !!v || "Select an event!" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <FormControl fullWidth error={invalid}>
                        <InputLabel id="tran-event-label">Linked Event *</InputLabel>
                        <Select
                          {...field}
                          labelId="tran-event-label"
                          label="Linked Event *"
                        >
                          {events.length === 0 ? (
                            <MenuItem disabled value="">
                              <Typography variant="body2" color="text.secondary">
                                No upcoming events found
                              </Typography>
                            </MenuItem>
                          ) : (
                            events.map((event) => (
                              <MenuItem key={event._id} value={event._id}>
                                <Box>
                                  <Typography variant="body2">{event.name}</Typography>
                                  {event.datetimeperiod?.[0] && (
                                    <Typography variant="caption" color="text.secondary">
                                      {ISOtoHuman(event.datetimeperiod[0], false, true)}
                                    </Typography>
                                  )}
                                </Box>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {error && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.75 }}
                          >
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                ) : (
                  <Controller
                    name="purpose"
                    control={control}
                    rules={{ required: !useEvent && "Purpose is required!" }}
                    render={({ field, fieldState: { error, invalid } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Purpose / Reason *"
                        multiline
                        minRows={3}
                        error={invalid}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* ── Right column: extras + submit ────────────────────────────── */}
        <Grid
          container
          spacing={3}
          sx={{ alignItems: "flex-start" }}
          size={{ xs: "grow", md: "grow" }}
        >
          {/* Section: Additional Info */}
          <Grid container size={12}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ textTransform: "uppercase", color: "text.secondary", mb: 2 }}
            >
              Additional Info
            </Typography>

            <Grid container spacing={2} size={12}>
              {/* point of contact */}
              {pocs.length > 0 ? (
                <Grid size={12}>
                  <Controller
                    name="poc"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="tran-poc-label">Point of Contact</InputLabel>
                        <Select
                          {...field}
                          labelId="tran-poc-label"
                          label="Point of Contact"
                        >
                          {pocs.map((poc) => (
                            <MenuItem key={poc.uid} value={poc.uid}>
                              {poc.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              ) : null}

              {/* remarks */}
              <Grid size={12}>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Remarks (optional)"
                      multiline
                      minRows={3}
                      helperText="Any additional notes for the SLO reviewer"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Grid container direction="row" spacing={1} sx={{ pt: 1 }} size={12}>
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
                onConfirm={() => router.push("/manage/inventory/transactions")}
                onClose={() => setCancelDialog(false)}
                confirmProps={{ color: "primary" }}
                confirmText="Yes, discard my changes"
              />
            </Grid>
            <Grid size={6}>
              <Tooltip
                title={
                  qtyExceedsAvailable
                    ? `Only ${netQty} unit${netQty === 1 ? "" : "s"} available`
                    : ""
                }
              >
                <span style={{ display: "block" }}>
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || qtyExceedsAvailable}
                  >
                    {submitLabel}
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}