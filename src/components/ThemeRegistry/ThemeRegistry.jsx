"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { useMode } from "contexts/ModeContext";

import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

export default function ThemeRegistry({ children, nonce }) {
  const prefersDarkMode = useMode();

  const themeOptions = React.useMemo(
    () => ({
      palette: prefersDarkMode.isDark ? palette.dark : palette.light,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      direction: "ltr",
      shadows: prefersDarkMode.isDark ? shadows.dark : shadows.light,
      customShadows: prefersDarkMode.isDark
        ? customShadows.dark
        : customShadows.light,
    }),
    [prefersDarkMode], // TODO: add setting dependency
  );
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  // Update the global background color
  React.useEffect(() => {
    const backgroundColor = prefersDarkMode.isDark
      ? palette.dark.background.default
      : palette.light.background.default;

    document.body.style.backgroundColor = backgroundColor;

    return () => {
      // Optional cleanup
      document.body.style.backgroundColor = "";
    };
  }, [prefersDarkMode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui", nonce: nonce }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
