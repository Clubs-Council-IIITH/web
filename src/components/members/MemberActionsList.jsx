"use client";

import { useEffect,useState,useEffectEvent } from "react";

import ActionPalette from "components/ActionPalette";
import {
  ApproveAllMember,
  DeleteMember,
  EditMember,
} from "components/members/MemberActions";

export default function MemberActionsList({
  member,
  user,
  allowEditing = true,
}) {
  const [actions, setActions] = useState([
    ...(allowEditing ? [EditMember] : []),
    DeleteMember,
  ]);

  const setActionsEffectEvent = useEffectEvent((newActions) => {
    setActions(newActions);
  });

  useEffect(() => {
    if (member && user && user?.role === "cc") {
      setActionsEffectEvent([...(allowEditing ? [EditMember] : []), DeleteMember]);
      let i = 0;
      for (i in member.roles) {
        if (
          member.roles[i].approved == false &&
          member.roles[i].rejected == false
        ) {
          setActionsEffectEvent([
            ApproveAllMember,
            ...(allowEditing ? [EditMember] : []),
            DeleteMember,
          ]);
          break;
        }
      }
    }
  }, [member, user, allowEditing]);

  return <ActionPalette right={actions} />;
}
