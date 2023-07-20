"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from "@mui/material";

import Icon from "components/Icon";
import { getFile } from "utils/files";
import { login, logout } from "utils/auth";

export default function AccountPopover({ user }) {
  const pathname = usePathname();
  const isAuthenticated = !Object.keys(user);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // options to show only when user is logged in
  const AUTHENTICATED_MENU_OPTIONS = [
    {
      label: "Profile",
      icon: "profile",
      url: "/profile",
      // onClick: () => router.push("/profile") && handleClose(),
    },
  ];

  // options to show even when user is not logged in
  const COMMON_MENU_OPTIONS = [
    // {
    //   label: "Settings",
    //   icon: "settings",
    //   url: "/settings"
    //   onClick: () => router.push("/settings") && handleClose(),
    // },
  ];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[700], 0.6),
            },
          }),
        }}
      >
        <Avatar
          src={getFile(user?.img)}
          alt="logged in"
          {...(user?.firstName && {
            children: `${user?.firstName?.[0]}${
              user?.lastName == "" ? "" : user?.lastName?.[0]
            }`,
            sx: {
              backgroundColor: "black",
            },
          })}
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        {isAuthenticated ? (
          // if authenticated, show user details and options
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {user?.email}
              </Typography>
            </Box>

            {[...AUTHENTICATED_MENU_OPTIONS, ...COMMON_MENU_OPTIONS].length >
            0 ? (
              <>
                <Divider sx={{ borderStyle: "dashed" }} />

                <Stack sx={{ p: 1 }}>
                  {[...AUTHENTICATED_MENU_OPTIONS, ...COMMON_MENU_OPTIONS].map(
                    (option) => (
                      <MenuItem
                        component={Link}
                        key={option.label}
                        href={option.url}
                      >
                        <Icon variant={option.icon} sx={{ mr: 2 }} />
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </Stack>
              </>
            ) : null}

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem onClick={() => logout(pathname)} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </>
        ) : (
          // else show login button
          <>
            {COMMON_MENU_OPTIONS.length > 0 ? (
              <>
                <Stack sx={{ p: 1 }}>
                  {COMMON_MENU_OPTIONS.map((option) => (
                    <MenuItem component={Link} key={option.label} href={url}>
                      <Icon variant={option.icon} sx={{ mr: 2 }} />
                      {option.label}
                    </MenuItem>
                  ))}
                </Stack>

                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            ) : null}

            <MenuItem onClick={() => login(pathname)} sx={{ m: 1 }}>
              Login
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}
