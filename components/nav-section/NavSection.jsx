import PropTypes from "prop-types";
import NextLink from "next/link";
import { useRouter } from "next/router";
// @mui
import { Box, List, ListItemText } from "@mui/material";
import { StyledNavItem, StyledNavItemIcon } from "./styles";

// ----------------------------------------------------------------------

export function isExternalLink(path) {
    return path.includes("http");
}

export function getActive(path, pathname, asPath) {
    if (path === "/") return pathname === path || asPath === path;
    return pathname.includes(path) || asPath.includes(path);
}

NavSection.propTypes = {
    data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {data.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </List>
        </Box>
    );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
    item: PropTypes.object,
};

function NavItem({ item }) {
    const { title, path, icon, info } = item;
    const { pathname, asPath } = useRouter();

    const active = getActive(item.path, pathname, asPath);

    return (
        <StyledNavItem
            component={NextLink}
            href={path}
            sx={{
                ...(active && {
                    color: "text.primary",
                    bgcolor: "action.selected",
                    fontWeight: "fontWeightBold",
                }),
            }}
        >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={title} />

            {info && info}
        </StyledNavItem>
    );
}
