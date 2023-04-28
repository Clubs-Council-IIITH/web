import PropTypes from "prop-types";

import { useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";

import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default function ThemeProvider({ children }) {
    const isLight = true; // TODO: add dark mode

    const themeOptions = useMemo(
        () => ({
            palette: isLight ? palette.light : palette.dark,
            typography,
            breakpoints,
            shape: { borderRadius: 8 },
            direction: "ltr",
            shadows: isLight ? shadows.light : shadows.dark,
            customShadows: isLight ? customShadows.light : customShadows.dark,
        }),
        [isLight]
    );

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    );
}
