"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { useState } from "react";

import { Button } from "@mui/material";

import Icon from "components/Icon";
import ConfirmDialog from "components/ConfirmDialog";

import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";

import {  deleteEventAction } from "actions/events/delete/server_action";
import { eventProgress } from "actions/events/progress/server_action";

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

export function EditFinances({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={Link}
      href={`/manage/finances/${id}`}
      variant="contained"
      color="warning"
      startIcon={<Icon variant="edit-outline" />}
      sx={sx}
    >
      Edit Bills Status
    </Button>
  );
}

export function CopyEvent({ sx }) {
  const { id } = useParams();

  return (
    <Button
      component={Link}
      href={`/manage/events/${id}/copy`}
      variant="contained"
      color="grey"
      startIcon={<Icon variant="content-copy-outline" />}
      sx={sx}
    >
      Copy Event
    </Button>
  );
}

export function DeleteEvent({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const deleteEvent = async () => {
    let res = await deleteEventAction(id);

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
    let res = await eventProgress({
      eventid: id,
    });

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

  const approveEvent = async () => {
    // console.log("requested approvals:", SLC, SLO);
    let res = await eventProgress({
      eventid: id,
    });
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
      {/* If user?.role === "cc", then redirect to /manage/events/id/approve_cc */}
      {user && user.role === "cc" ? (
        <Button
          component={Link}
          href={`/manage/events/${id}/approve_cc`}
          variant="contained"
          color="success"
          startIcon={<Icon variant="done" />}
          sx={sx}
        >
          Approve
        </Button>
      ) : (
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
            description="This action cannot be undone."
            onConfirm={approveEvent}
            onClose={() => setDialog(false)}
            confirmProps={{ color: "success" }}
            confirmText="Yes, approve it"
          />
        </>
      )}
    </>
  );
}
