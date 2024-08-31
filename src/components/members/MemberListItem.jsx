"use client";

import { useState, useEffect } from "react";
import { ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import UserImage from "components/users/UserImage";

import { useToast } from "components/Toast";

import { getUsers } from "actions/users/get/server_action";

export default function MemberListItem({ uid, showEmail = true }) {
  const { triggerToast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (uid) await getUser();
    })();
  }, [uid]);

  const getUser = async () => {
    const res = await getUsers(uid);

    if (res.ok) {
      // set current user
      setUser(res.data);
    } else {
      // show error toast
      triggerToast({
        ...res.error,
        severity: "error",
      });
    }
  };

  return user ? (
    <ListItem>
      <ListItemAvatar>
        <UserImage
          image={user.img}
          name={user.firstName}
          gender={user.gender}
          width={36}
          height={36}
        />
      </ListItemAvatar>
      <ListItemText
        primary={user.firstName + " " + user.lastName}
        secondary={showEmail ? user.email : null}
      />
    </ListItem>
  ) : null;
}
