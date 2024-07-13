"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import Icon from "components/Icon";
import { useToast } from "components/Toast";
import MemberListItem from "components/members/MemberListItem";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Fade,
  CircularProgress,
  Typography,
  FormControlLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function EventApproveForm({ event, members }) {
  const { triggerToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      SLC: false,
      SLO: false,
    },
  });

  async function handleApprove(formData) {
    let cc_progress_budget = !formData.SLC;
    let cc_progress_room = !formData.SLO;
    let approver = formData.approver;

    setLoading(true);

    let res = await fetch("/actions/events/progress", {
      method: "POST",
      body: JSON.stringify({
        eventid: event._id,
        cc_progress_budget: cc_progress_budget,
        cc_progress_room: cc_progress_room,
        cc_approver: approver,
      }),
    });
    if (res.ok) {
      triggerToast("Event approved", "success");
      router.push(`/manage/events/${event._id}`);
      router.refresh();
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleApprove)}>
        <Controller
          name="SLC"
          control={control}
          disabled={true}
          render={({ field }) => (
            <>
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="success" />
                }
                label="Request SLC approval"
              />
              <Typography variant="caption" color="textSecondary">
                (Coming Soon)
              </Typography>
            </>
          )}
        />
        <p></p> {/* For New line */}
        <Controller
          name="SLO"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox {...field} checked={field.value} color="success" />
              }
              label="Request SLO approval"
            />
          )}
        />
        <p></p> {/* For New line */}
        <Controller
          name="approver"
          control={control}
          rules={{ required: "Select a member!" }}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormControl variant="outlined" fullWidth error={invalid}>
              <InputLabel id="approver-label">Approver</InputLabel>
              {members.length === 0 ? (
                <Box
                  py={25}
                  width="100%"
                  display="flex"
                  justifyContent="center"
                >
                  <Fade in>
                    <CircularProgress color="primary" />
                  </Fade>
                </Box>
              ) : (
                <Select
                  labelId="poc"
                  label="Point of Contact *"
                  fullWidth
                  {...field}
                  MenuProps={{
                    style: { maxHeight: 400 },
                  }}
                >
                  {members?.slice()?.map((member) => (
                    <MenuItem key={member.uid} value={member.uid}>
                      <MemberListItem uid={member.uid} />
                    </MenuItem>
                  ))}
                </Select>
              )}
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <p></p> {/* For New line */}
        <LoadingButton
          loading={loading}
          type="submit"
          size="large"
          variant="contained"
          color="success"
          startIcon={<Icon variant="done" />}
          //   fullWidth
        >
          Approve
        </LoadingButton>
        <Typography variant="caption" color="textSecondary" ml={1}>
          (This action cannot be undone.)
        </Typography>
      </form>
    </>
  );
}
