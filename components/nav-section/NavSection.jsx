import PropTypes from "prop-types";
import NextLink from "next/link";

import { useRouter } from "next/router";
import { Box, List, ListItemText } from "@mui/material";
import { StyledNavItem, StyledNavItemIcon } from "./styles";
import { LaunchTwoTone as ExternalIcon } from "@mui/icons-material";

export function isExternalLink(path) {
  return path.includes("http");
}

export function getActive(path, pathname, asPath) {
  if (path === "/") return pathname === path || asPath === path;
  return pathname.startsWith(path) || asPath.startsWith(path);
}

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1, pt: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;
  const { pathname, asPath } = useRouter();

  const active = getActive(item.path, pathname, asPath);
  const external = isExternalLink(item.path);

  return (
    <StyledNavItem component={NextLink} href={path} active={active}>
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText
        disableTypography
        primary={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {title}
            {external && <ExternalIcon fontSize="small" sx={{ mx: 2 }} />}
          </Box>
        }
      />

      {info && info}
    </StyledNavItem>
  );
}
