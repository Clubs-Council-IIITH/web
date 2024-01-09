"use client";

import { useState, useEffect } from "react";
import { ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import UserImage from "components/users/UserImage";

import { useToast } from "components/Toast";

export default function MemberListItem({ uid }) {
  const { triggerToast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      if (uid) await getUser();
    })();
  }, [uid]);

  const getUser = async () => {
    let res = await fetch("/actions/users/get", {
      method: "POST",
      body: JSON.stringify({ uid }),
    });
    res = await res.json();

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
        secondary={user.email}
      />
    </ListItem>
  ) : null;
}
