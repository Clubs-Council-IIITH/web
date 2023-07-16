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

// define top bar width
const BAR_HEIGHT_MOBILE = 64;
const BAR_HEIGHT_DESKTOP = 92;

// define navigation drawer width
const DRAWER_WIDTH = 280;

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
        ></Stack>
      </Toolbar>
    </AppBar>
  );
}

function Drawer({ drawerOpen, onCloseDrawer }) {
  const theme = useTheme();
  const pathname = usePathname();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (drawerOpen) onCloseDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
    </List>
  );

  const aboutItems = (
    <>
      <List disablePadding sx={{ p: 1, pt: 1 }}>
        <Box px={4}>
          <Typography variant="overline">About</Typography>
        </Box>
        <DrawerItem
          title="clubs council"
          path="/clubs-council"
          icon={<Icon variant="admin-panel-settings-outline-rounded" />}
        />
        <DrawerItem
          title="supervisory bodies"
          path="/supervisory-bodies"
          icon={<Icon variant="info-outline-rounded" />}
        />
      </List>
    </>
  );

  const helpItems = (
    <>
      <List disablePadding sx={{ p: 1, pt: 1 }}>
        <Box px={4}>
          <Typography variant="overline">Help</Typography>
        </Box>
        <DrawerItem
          title="report bugs"
          path="https://forms.office.com/r/zBLuvbBPXZ"
          icon={<Icon variant="bug-report-outline-rounded" />}
        />
      </List>
    </>
  );

  const drawerContent = (
    <>
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <Logo />
      </Box>
      {publicItems}
      {aboutItems}
      {helpItems}
      <Box sx={{ flexGrow: 1 }} />
    </>
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

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          overflow: "auto",
          minHeight: "100%",
          paddingTop: `${BAR_HEIGHT_MOBILE}px`,
          paddingBottom: theme.spacing(5),
          [theme.breakpoints.up("lg")]: {
            paddingTop: `${BAR_HEIGHT_DESKTOP}px`,
            paddingLeft: `${DRAWER_WIDTH}px`,
            paddingRight: theme.spacing(2),
          },
        }}
      >
        <Box p={1}>{children}</Box>
      </Box>
    </Box>
  );
}
