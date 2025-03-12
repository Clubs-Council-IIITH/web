"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, TextField } from "@mui/material";
import { useToast } from "components/Toast";
import ConfirmDialog from "components/ConfirmDialog";
import { eventBillStatus } from "actions/events/bills/bill-status/server_action";

export default function BillsStatusForm({ id = null, defaultValues = {} }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const { control, handleSubmit, setValue } = useForm({ defaultValues });
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
          <Grid item xs={4}>
            <LoadingButton
              size="large"
              variant="contained"
              color="error"
              fullWidth
              loading={loading}
              onClick={() => {
                setValue("state", "rejected");
                handleSubmit(submitHandler)();
              }}
            >
              Reject
            </LoadingButton>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <LoadingButton
              size="large"
              variant="contained"
              color="success"
              fullWidth
              loading={loading}
              onClick={() => {
                setValue("state", "accepted");
                handleSubmit(submitHandler)();
              }}
            >
              Accept
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
