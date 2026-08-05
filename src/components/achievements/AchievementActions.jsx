"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { approveAchievementAction } from "actions/achievements/approve/server_action";
import { rejectAchievementAction } from "actions/achievements/reject/server_action";
import { deleteAchievementAction } from "actions/achievements/delete/server_action";

export function ApproveAchievement({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const approve = async () => {
    const res = await approveAchievementAction({ achievementId: id });
    if (res.ok) {
      triggerToast({
        title: "Success!",
        messages: ["Achievement approved."],
        severity: "success",
      });
      router.refresh();
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
    setDialog(false);
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
        title="Approve this achievement?"
        description="This will mark the achievement as approved and make it publicly visible. This action cannot be undone."
        onConfirm={approve}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "success" }}
        confirmText="Yes, approve it"
      />
    </>
  );
}

export function RejectAchievement({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const reject = async () => {
    const res = await rejectAchievementAction({ achievementId: id });
    if (res.ok) {
      triggerToast({
        title: "Success!",
        messages: ["Achievement rejected."],
        severity: "success",
      });
      router.refresh();
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
    setDialog(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        startIcon={<Icon variant="close" />}
        onClick={() => setDialog(true)}
        sx={sx}
      >
        Reject
      </Button>

      <ConfirmDialog
        open={dialog}
        title="Reject this achievement?"
        description="This will mark the achievement as rejected and return it to the submitting club. This action cannot be undone."
        onConfirm={reject}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "warning" }}
        confirmText="Yes, reject it"
      />
    </>
  );
}

export function DeleteAchievement({ sx }) {
  const router = useRouter();
  const { id } = useParams();
  const { triggerToast } = useToast();
  const [dialog, setDialog] = useState(false);

  const deleteAchievement = async () => {
    const res = await deleteAchievementAction({ achievementId: id });
    if (res.ok) {
      triggerToast({
        title: "Success!",
        messages: ["Achievement deleted."],
        severity: "success",
      });
      router.push("/manage/achievements");
    } else {
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
    setDialog(false);
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
        title="Delete this achievement?"
        description="Deleting the achievement will mark it as deleted and hide it from the public. This action cannot be undone."
        onConfirm={deleteAchievement}
        onClose={() => setDialog(false)}
        confirmProps={{ color: "error" }}
        confirmText="Yes, delete it"
      />
    </>
  );
}
