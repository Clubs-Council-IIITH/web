"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Box,
  List,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer as MUIDrawer,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { bgBlur } from "utils/cssStyles";
import Logo from "components/Logo";
import Icon from "components/Icon";
import DrawerItem from "components/DrawerItem";
import Footer from "components/Footer";
import AccountPopover from "components/profile/AccountPopover";
import ScrollbarWrapper from "./ScrollbarWrapper";
import { useAuth } from "./AuthProvider";

// define top bar width
const BAR_HEIGHT_MOBILE = 64;
const BAR_HEIGHT_DESKTOP = 92;

// define navigation drawer width
const DRAWER_WIDTH = 280;

// bug report external link
export const BUG_REPORT_URL = "https://forms.office.com/r/zBLuvbBPXZ";

function Bar({ onOpenDrawer }) {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        ...bgBlur({ color: theme.palette.background.default }),
        boxShadow: "none",
        [theme.breakpoints.up("lg")]: {
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
      }}
    >
      <Toolbar
        sx={{
          minHeight: BAR_HEIGHT_MOBILE,
          [theme.breakpoints.up("lg")]: {
            minHeight: BAR_HEIGHT_DESKTOP,
            padding: theme.spacing(0, 5),
          },
        }}
      >
        <IconButton
          onClick={onOpenDrawer}
          sx={{
            mr: 1,
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <Icon variant="menu-open-rounded" />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Drawer({ drawerOpen, onCloseDrawer }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { user } = useAuth();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (drawerOpen) onCloseDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // nav items that everybody can see
  const publicItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <DrawerItem
        title="home"
        path="/"
        icon={<Icon variant="home-outline-rounded" />}
      />
      <DrawerItem
        title="clubs"
        path="/clubs"
        icon={<Icon variant="explore-outline-rounded" />}
      />
      <DrawerItem
        title="student bodies"
        path="/student-bodies"
        icon={<Icon variant="groups-3-outline-rounded" />}
      />
      <DrawerItem
        title="events"
        path="/events"
        icon={<Icon variant="local-activity-outline-rounded" />}
      />
      <DrawerItem
        title="calendar"
        path="/calendar"
        icon={<Icon variant="calendar-month-outline-rounded" />}
      />
      <DrawerItem
        title="gallery"
        path="/gallery"
        icon={<Icon variant="gallery-thumbnail-outline-rounded" />}
      />
    </List>
  );

  // nav items that only club accounts can see
  const clubItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <Box px={4}>
        <Typography variant="overline">Manage</Typography>
      </Box>
      <DrawerItem
        title="club"
        path="/manage/clubs"
        icon={<Icon variant="explore-outline-rounded" />}
      />
      <DrawerItem
        title="events"
        path="/manage/events"
        icon={<Icon variant="local-activity-outline-rounded" />}
      />
      <DrawerItem
        title="members"
        path="/manage/members"
        icon={<Icon variant="group-outline-rounded" />}
      />
    </List>
  );

  // nav items that only CC can see
  const ccItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <Box px={4}>
        <Typography variant="overline">Manage</Typography>
      </Box>
      <DrawerItem
        title="clubs & bodies"
        path="/manage/clubs"
        icon={<Icon variant="explore-outline-rounded" />}
      />
      <DrawerItem
        title="events"
        path="/manage/events"
        icon={<Icon variant="local-activity-outline-rounded" />}
      />
      <DrawerItem
        title="members"
        path="/manage/members"
        icon={<Icon variant="group-outline-rounded" />}
      />
    </List>
  );

  // nav items that only SLC + SLO can see
  const adminItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <Box px={4}>
        <Typography variant="overline">Manage</Typography>
      </Box>
      <DrawerItem
        title="events"
        path="/manage/events"
        icon={<Icon variant="local-activity-outline-rounded" />}
      />
    </List>
  );

  // nav items with about info that everybody can see
  const aboutItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <Box px={4}>
        <Typography variant="overline">About</Typography>
      </Box>
      <DrawerItem
        title="clubs council"
        path="/about/clubs-council"
        icon={<Icon variant="admin-panel-settings-outline-rounded" />}
      />
      <DrawerItem
        title="supervisory bodies"
        path="/about/supervisory-bodies"
        icon={<Icon variant="info-outline-rounded" />}
      />
    </List>
  );

  // nav items with help info that everybody can see
  const helpItems = (
    <List disablePadding sx={{ p: 1, pt: 1 }}>
      <Box px={4}>
        <Typography variant="overline">Help</Typography>
      </Box>
      <DrawerItem
        title="report bugs"
        path={BUG_REPORT_URL}
        icon={<Icon variant="bug-report-outline-rounded" />}
      />
    </List>
  );

  const drawerContent = (
    <ScrollbarWrapper>
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>
      {publicItems}
      {["club"].includes(user.role) ? clubItems : null}
      {["cc"].includes(user.role) ? ccItems : null}
      {["slc", "slo"].includes(user.role) ? adminItems : null}
      {aboutItems}
      {helpItems}
      <Box sx={{ flexGrow: 1 }} />
    </ScrollbarWrapper>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: DRAWER_WIDTH },
      }}
    >
      {isDesktop ? (
        <MUIDrawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {drawerContent}
        </MUIDrawer>
      ) : (
        <MUIDrawer
          open={drawerOpen}
          onClose={onCloseDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </MUIDrawer>
      )}
    </Box>
  );
}

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Bar onOpenDrawer={() => setDrawerOpen(true)} />
      <Drawer
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
      />
    </>
  );
}

export function Content({ children }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <ScrollbarWrapper>
      <Box
        sx={{
          display: "flex",
          minHeight: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          component="main"
          sx={{
            overflow: "auto",
            minHeight: "100%",
            width: "100%",
            paddingTop: `${BAR_HEIGHT_MOBILE}px`,
            paddingBottom: theme.spacing(5),
            [theme.breakpoints.up("lg")]: {
              paddingTop: `${BAR_HEIGHT_DESKTOP}px`,
              paddingLeft: `${DRAWER_WIDTH}px`,
              paddingRight: theme.spacing(2),
            },
          }}
        >
          <Box px={isDesktop ? 4 : 2}>
            {children}
            <Footer />
          </Box>
        </Box>
      </Box>
    </ScrollbarWrapper>
  );
}
