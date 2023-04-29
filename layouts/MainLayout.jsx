import { useState } from "react";

import { styled, useTheme } from "@mui/material/styles";
import { Scrollbars } from "react-custom-scrollbars-2";

import LoadingBar from "react-top-loading-bar";

import Header from "./header";
import Nav from "./nav";
import { useProgressbar } from "contexts/ProgressbarContext";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
    display: "flex",
    minHeight: "100%",
    overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflow: "auto",
    minHeight: "100%",
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.up("lg")]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
}));

export default function MainLayout({ children }) {
    const [open, setOpen] = useState(false);
    const { ref } = useProgressbar();
    const theme = useTheme();

    return (
        <StyledRoot>
            <LoadingBar ref={ref} height={3} color={theme.palette.accent} />
            <Header onOpenNav={() => setOpen(true)} />
            <Nav openNav={open} onCloseNav={() => setOpen(false)} />
            <Scrollbars autoHide universal={true} style={{ height: "100vh" }}>
                <Main>{children}</Main>
            </Scrollbars>
        </StyledRoot>
    );
}
