'use client';

import { useState, useEffect } from "react";

import ActionPalette from "components/ActionPalette";
import { EditMember, DeleteMember, ApproveAllMember } from "components/members/MemberActions";

export default function MemberActionsList({ member, user }) {
  const [actions, setActions] = useState([EditMember, DeleteMember]);

  useEffect(() => {
    if (member && user && user?.role === "cc") {
      setActions([EditMember, DeleteMember]);
      let i = 0;
      for (i in member.roles) {
        if (member.roles[i].approved == false && member.roles[i].rejected == false) {
          setActions([ApproveAllMember, EditMember, DeleteMember]);
          break;
        }
      }
    }
  }, [member, user]);

  return (
    <ActionPalette right={actions} />
  );
}
