import PropTypes from "prop-types";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Drawer, Typography } from "@mui/material";
import { Scrollbars } from "react-custom-scrollbars-2";

import useResponsive from "hooks/useResponsive";

import Logo from "components/logo";
import NavSection from "components/nav-section";

import { getNavConfig } from "utils/navigation";
import { useAuth } from "contexts/AuthContext";

// define navigation sidebar width
const NAV_WIDTH = 280;

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
    const { pathname } = useRouter();
    const { user } = useAuth();

    const isDesktop = useResponsive("up", "lg");

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbars autoHide universal={true} style={{ height: "100%" }}>
            <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
                <Logo />
            </Box>

            {getNavConfig(user).map((section, idx) => (
                <Box key={idx} mb={2}>
                    <Typography variant="caption" fontWeight="bold" px={5}>
                        {section.header.toUpperCase()}
                    </Typography>
                    <NavSection data={section.items} />
                </Box>
            ))}

            <Box sx={{ flexGrow: 1 }} />
        </Scrollbars>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV_WIDTH },
            }}
        >
            {isDesktop ? (
                <Drawer
                    open
                    variant="permanent"
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                            bgcolor: "background.default",
                            borderRightStyle: "dashed",
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: { width: NAV_WIDTH },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
