// @mui
import { alpha, styled } from "@mui/material/styles";
import { ListItemIcon, ListItemButton } from "@mui/material";

export const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ active, theme }) => ({
  ...theme.typography.body2,
  position: "relative",
  height: 48,
  textTransform: "capitalize",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  // active
  ...(active && {
    ...theme.typography.subtitle2,
    color: theme.palette.accent,
    backgroundColor: alpha(theme.palette.accent, theme.palette.action.selectedOpacity),
  }),
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
