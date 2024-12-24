"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import {
  Select,
  MenuItem,
  Button,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useToast } from "components/Toast";
import ConfirmDialog from "components/ConfirmDialog";
import { billsStateLabel } from "utils/formatEvent";

import { eventBillStatus } from "actions/events/edit/bill-status/server_action";

const states = ["not_submitted", "incomplete", "submitted", "slo_processed"];

export default function BillsStatusForm({ id = null, defaultValues = {} }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues,
  });
  const { triggerToast } = useToast();

  const submitHandler = async (data) => {
    setLoading(true);
    let details = {
      eventid: id,
      state: data.state,
      sloComment: data.sloComment,
    };

    let res = await eventBillStatus(details);

    if (res.ok) {
      triggerToast({
        title: "Success!",
        messages: ["Bill status updated."],
        severity: "success",
      });
      router.push("/manage/finances/");
      router.refresh();
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="state"
            control={control}
            rules={{
              required: "State is required!",
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <FormControl fullWidth error={invalid}>
                <InputLabel id="clubid">Status *</InputLabel>
                <Select labelId="state" label="Status *" fullWidth {...field}>
                  {states?.map((state) => (
                    <MenuItem key={state} value={state}>
                      {billsStateLabel(state).name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="sloComment"
            control={control}
            rules={{
              maxLength: {
                value: 1000,
                message: "Comment must be at most 1000 characters long!",
              },
              minLength: {
                value: 2,
                message: "Comment must be at least 2 characters long!",
              },
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                label="Comment"
                autoComplete="off"
                error={invalid}
                helperText={error?.message}
                variant="outlined"
                rows={4}
                fullWidth
                multiline
              />
            )}
          />
        </Grid>
        <Grid container item direction="row" xs={12} spacing={1} pt={3}>
          <Grid item xs={6}>
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
              onClose={() => setCancelDialog(false)}
              onConfirm={() => router.back()}
              title="Confirm cancellation"
              description="Are you sure you want to cancel? All unsaved changes will be lost."
              confirmProps={{ color: "primary" }}
              confirmText="Yes, discard my changes"
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
