// AccountPopover.js

import React from "react";
import { IconButton, Avatar, Popover, MenuItem, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Icon from "components/Icon";
import { getFile } from "utils/files";
import { login, logout } from "utils/auth";
import { useAuth } from "components/AuthProvider";
import { useMode } from "contexts/ModeContext";
import { ModeSwitch } from "components/ModeSwitch";
import { usePathname } from "next/navigation";

export default function AccountPopover() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { isLight, setMode } = useMode(); // Accessing isLight and setMode from ModeContext
  console.log("first isLight is:",isLight);
  const [open, setOpen] = React.useState(null);

  const handleChange = () => {
    // handleupdate();
    console.log("value of switch going to set is:",isLight);
    setMode(!isLight); // Toggle the mode
    console.log("setting theme in storage:",!isLight);
    setThemeInStorage(!isLight);
  };
  const setThemeInStorage = (theme) => {
    localStorage.setItem('theme', theme)
 }
 
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const AUTHENTICATED_MENU_OPTIONS = [
    {
      label: "Profile",
      icon: "person",
      url: "/profile",
    },
  ];

  const COMMON_MENU_OPTIONS = [];

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar width={40} height={40} sx={{ backgroundColor: "black" }}>
          {user?.img ? (
            <Image
              alt={user?.firstName}
              src={getFile(user?.img)}
              width={400}
              height={400}
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
              }}
            />
          ) : user?.firstName ? (
            `${user?.firstName?.[0]}${user?.lastName === "" ? "" : user?.lastName?.[0]}`
          ) : null}
        </Avatar>
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
        <ModeSwitch checked={!isLight} onChange={handleChange} sx={{ m: 1 }} /> {/* Pass current isLight value and handleChange function to ModeSwitch component */}

        {isAuthenticated ? (
          <>
            <Stack sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                {user?.email}
              </Typography>
            </Stack>

            {[...AUTHENTICATED_MENU_OPTIONS, ...COMMON_MENU_OPTIONS].length > 0 ? (
              <>
                <Divider sx={{ borderStyle: "dashed" }} />

                <Stack sx={{ p: 1 }}>
                  {[...AUTHENTICATED_MENU_OPTIONS, ...COMMON_MENU_OPTIONS].map((option) => (
                    <MenuItem component={Link} key={option.label} href={option.url}>
                      <Icon variant={option.icon} sx={{ mr: 2 }} />
                      {option.label}
                    </MenuItem>
                  ))}
                </Stack>
              </>
            ) : null}

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem onClick={() => logout(pathname)} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            {COMMON_MENU_OPTIONS.length > 0 ? (
              <>
                <Stack sx={{ p: 1 }}>
                  {COMMON_MENU_OPTIONS.map((option) => (
                    <MenuItem component={Link} key={option.label} href={option.url}>
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
