"use client";

import { useState, useEffect } from "react";
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
  Chip,
  Divider,
} from "@mui/material";

import { eventProgress } from "actions/events/progress/server_action";
import { getUserByRole } from "actions/users/get/role/server_action";

export default function EventApproveForm({ eventid, members }) {
  const { triggerToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      SLC: false,
      SLO: false,
    },
  });

  const watchSLC = watch("SLC");
  const [slcMembers, setSlcMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (watchSLC && slcMembers.length === 0) {
        let res = await getUserByRole("slc");

        if (res.ok) {
          setSlcMembers(res.data);
        } else {
          triggerToast({
            ...res.error,
            severity: "error",
          });
        }
      }
    };
    fetchData();
  }, [watchSLC]);

  async function handleApprove(formData) {
    setLoading(true);

    let cc_progress_budget = !formData.SLC;
    let cc_progress_room = !formData.SLO;
    let approver = formData.approver;
    let slc_members_for_email = formData.slcMembersForEmail;

    let res = await eventProgress({
      eventid: eventid,
      cc_progress_budget: cc_progress_budget,
      cc_progress_room: cc_progress_room,
      cc_approver: approver,
      slc_members_for_email: slc_members_for_email,
    });
    if (res.ok) {
      triggerToast("Event approved", "success");
      router.push(`/manage/events/${eventid}`);
      router.refresh();
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }

    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleApprove)}>
        <Controller
          name="SLC"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox {...field} checked={field.value} color="success" />
              }
              label="Request SLC approval"
            />
          )}
        />
        {watchSLC ? (
          <>
            <p></p>
            <Controller
              name="slcMembersForEmail"
              control={control}
              defaultValue={[]}
              rules={{ required: "Select atleast one SLC Member!" }}
              render={({ field, fieldState: { error, invalid } }) => (
                <FormControl variant="outlined" fullWidth error={invalid}>
                  <InputLabel id="approver-label">
                    SLC Members to Send Email
                  </InputLabel>
                  {slcMembers.length === 0 ? (
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
                      multiple
                      labelId="poc"
                      label="Point of Contact *"
                      fullWidth
                      {...field}
                      MenuProps={{
                        style: { maxHeight: 400, marginBottom: 50 },
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                <MemberListItem uid={value} showEmail={false} />
                              }
                              sx={{ marginBottom: 1 }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {slcMembers?.slice()?.map((member) => (
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
          </>
        ) : null}
        <p></p> {/* For New line */}
        <Divider />
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
        <Divider />
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
