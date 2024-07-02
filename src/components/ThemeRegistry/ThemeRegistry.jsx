"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { useMode } from "contexts/ModeContext";

import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

export default function ThemeRegistry({ children }) {
  // const [prefersDarkMode,setPrefersDarkMode] = React.useState(useMode()); // useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkMode =useMode();
 

  const themeOptions = React.useMemo(
    () => ({
      palette: prefersDarkMode.isLight ? palette.dark : palette.light,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      direction: "ltr",
      shadows: prefersDarkMode.isLight ? shadows.dark : shadows.light,
      customShadows: prefersDarkMode.isLight ? customShadows.dark : customShadows.light,
    }),
    [prefersDarkMode], // TODO: add setting dependency
  );
  const theme = createTheme(themeOptions);
  
  theme.components = componentsOverride(theme);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
