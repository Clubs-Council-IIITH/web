import { useState } from "react";

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

import { useAuth } from "contexts/AuthContext";

const AUTHENTICATED_MENU_OPTIONS = [
    // {
    //     label: "Profile",
    //     icon: "eva:person-fill",
    // },
];

const COMMON_MENU_OPTIONS = [
    // {
    //     label: "Settings",
    //     icon: "eva:settings-2-fill",
    // },
];

export default function AccountPopover() {
    const { isAuthenticated, user, login, logout } = useAuth();
    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

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
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar
                    src={null}
                    alt="logged in"
                    {...(user?.firstName && {
                        children: `${user?.firstName?.[0]}${user?.lastName?.[0]}`,
                        sx: { backgroundColor: theme.palette.accent },
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
                            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                                {user?.email}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Stack sx={{ p: 1 }}>
                            {[...AUTHENTICATED_MENU_OPTIONS, ...COMMON_MENU_OPTIONS].map(
                                (option) => (
                                    <MenuItem key={option.label} onClick={handleClose}>
                                        {option.label}
                                    </MenuItem>
                                )
                            )}
                        </Stack>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <MenuItem onClick={logout} sx={{ m: 1 }}>
                            Logout
                        </MenuItem>
                    </>
                ) : (
                    // else show login button
                    <>
                        <Stack sx={{ p: 1 }}>
                            {COMMON_MENU_OPTIONS.map((option) => (
                                <MenuItem key={option.label} onClick={handleClose}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Stack>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <MenuItem onClick={login} sx={{ m: 1 }}>
                            Login
                        </MenuItem>
                    </>
                )}
            </Popover>
        </>
    );
}
