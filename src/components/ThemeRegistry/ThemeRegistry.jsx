"use client";

import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useMode } from "contexts/ModeContext";

import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows, { customShadows } from "./shadows";
import typography from "./typography";

export default function ThemeRegistry({ children }) {
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
    [prefersDarkMode],
  );
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  // Update the global background color
  React.useEffect(() => {
    const backgroundColor = prefersDarkMode.isDark
      ? palette.dark.background.default
      : palette.light.background.default;

    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.colorScheme = prefersDarkMode.isDark
      ? "dark"
      : "light";

    return () => {
      // Optional cleanup
      document.body.style.backgroundColor = "";
      document.documentElement.style.colorScheme = "";
    };
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
