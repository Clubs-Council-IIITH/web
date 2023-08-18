'use client';

import { useState, useEffect } from "react";

import ActionPalette from "components/ActionPalette";
import { EditMember, DeleteMember, ApproveAllMember } from "components/members/MemberActions";

export default async function ManageMember({ member }) {
    const [actions, setActions] = useState([EditMember, DeleteMember]);

    useEffect(() => {
        if (member) {
            setActions([EditMember, DeleteMember]);
            let i = 0;
            for (i in member.roles) {
                if (member.roles[i].approved == false) {
                    setActions([ApproveAllMember, EditMember, DeleteMember]);
                    break;
                }
            }
        }
    }, [member]);

    console.log(actions)

    return (
        <ActionPalette right={actions} />
    );
}
