"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { useState } from "react";

import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";

import Icon from "components/Icon";
import ConfirmDialog from "components/ConfirmDialog";

import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";

export function EditEvent({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={Link}
      href={`/manage/events/${id}/edit`}
      variant="contained"
      color="warning"
      startIcon={<Icon variant="edit-outline" />}
      sx={sx}
    >
      Edit
    </Button>
  );
}

export function DeleteEvent({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const deleteEvent = async () => {
    let res = await fetch("/actions/events/delete", {
      method: "POST",
      body: JSON.stringify({ eventid: id }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Event deleted."],
        severity: "success",
      });
      router.push("/manage/events");
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Icon variant="delete-forever-outline" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Delete
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Are you sure you want to delete this event?"
        description="Deleting the event will mark it as deleted and hidden from the public. This action cannot be undone."
        onConfirm={deleteEvent}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}

export function SubmitEvent({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();

  const submitEvent = async () => {
    let res = await fetch("/actions/events/progress", {
      method: "POST",
      body: JSON.stringify({ eventid: id }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Event submitted."],
        severity: "success",
      });
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <Button
      variant="contained"
      color="info"
      startIcon={<Icon variant="thumb-up-outline-rounded" />}
      onClick={submitEvent}
      sx={sx}
    >
      Submit
    </Button>
  );
}

export function ApproveEvent({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  // approval checks
  const [SLC, setSLC] = useState(false);
  const [SLO, setSLO] = useState(false);

  const approvalDialog =
    user?.role === "cc" ? (
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={SLC}
              onClick={(e) => setSLC(e.target.checked)}
              color="success"
            />
          }
          label="Request SLC approval (for budget, if requested)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={SLO}
              onClick={(e) => setSLO(e.target.checked)}
              color="success"
            />
          }
          label="Request SLO approval (for venue, if requested)"
        />
      </Box>
    ) : (
      "This action cannot be undone."
    );

  const approveEvent = async () => {
    console.log("requested approvals:", SLC, SLO);
    let res = await fetch("/actions/events/progress", {
      method: "POST",
      body: JSON.stringify({
        eventid: id,
        cc_progress_budget: !SLC,
        cc_progress_room: !SLO,
      }),
    });
    res = await res.json();

    if (res.ok) {
      // show success toast & redirect to manage page
      triggerToast({
        title: "Success!",
        messages: ["Event approved."],
        severity: "success",
      });
      router.refresh();
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<Icon variant="done" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Approve
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Are you sure you want to approve this event?"
        description={approvalDialog}
        onConfirm={approveEvent}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "success" }}
        confirmText="Yes, approve it"
      />
    </>
  );
}
