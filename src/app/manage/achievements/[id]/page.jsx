import { redirect } from "next/navigation";

import { Container } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_ACHIEVEMENT_BY_ID } from "gql/queries/achievements";
import { GET_USER } from "gql/queries/auth";

import {
  ApproveAchievement,
  DeleteAchievement,
  EditAchievement,
  RejectAchievement,
} from "components/achievements/AchievementActions";
import AchievementDetails from "components/achievements/AchievementDetails";
import ActionPalette from "components/ActionPalette";
import Icon from "components/Icon";
import Tag from "components/Tag";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { data = {} } = await getClient().query(GET_ACHIEVEMENT_BY_ID, {
      achievementid: id,
    });
    return {
      title: data?.achievementById?.name ?? "Achievement",
    };
  } catch {
    return { title: "Achievement" };
  }
}

function getActions(achievement) {
  if (achievement?.status?.state === "deleted") {
    return [];
  }

  if (achievement?.status?.state === "rejected") {
    return [DeleteAchievement];
  }

  if (achievement?.status?.state === "approved") {
    return [EditAchievement, DeleteAchievement];
  }

  if (achievement?.status?.state === "pending") {
    return [
      EditAchievement,
      ApproveAchievement,
      RejectAchievement,
      DeleteAchievement,
    ];
  }
}

export default async function ManageAchievementPage(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { document, variables } = combineQuery(
      "CombinedManageAchievementQuery",
    )
      .add(GET_USER, { userInput: null })
      .add(GET_ACHIEVEMENT_BY_ID, { achievementid: id });

    const { data = {} } = await getClient().query(document, variables);
    const { userMeta, achievementById: achievement } = data;

    if (!achievement) redirect("/404");

    if (
      userMeta?.role === "club" &&
      !achievement?.clubids?.includes(userMeta?.uid)
    ) {
      redirect("/manage/achievements");
    }

    const sloActions =
      userMeta?.role === "slo" || userMeta?.role === "cc"
        ? getActions(achievement)
        : [];

    return (
      <Container>
        <ActionPalette
          left={[AchievementStatus]}
          leftProps={[{ status: achievement?.status }]}
          right={sloActions}
        />
        <AchievementDetails achievement={achievement} />
      </Container>
    );
  } catch {
    redirect("/404");
  }
}

export function AchievementStatus({ status }) {
  const statusMap = {
    pending: {
      label: "Pending",
      color: "info",
      icon: "clock",
    },
    approved: {
      label: "Approved",
      color: "success",
      icon: "check",
    },
    rejected: {
      label: "Rejected",
      color: "warning",
      icon: "close",
    },
    deleted: {
      label: "Deleted",
      color: "error",
      icon: "delete",
    },
  };

  const current = statusMap[status?.state] ?? statusMap.pending;

  return (
    <Tag
      sx={{
        height: 36,
        px: 1,
      }}
      label={current.label}
      color={current.color}
      icon={<Icon external variant={current.icon} />}
    />
  );
}
