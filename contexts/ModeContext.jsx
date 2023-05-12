import { createContext, useState, useContext, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';

export const ModeContext = createContext({
    isLight: true,
    trackProgress: () => null,
});

export function useMode() {
    return useContext(ModeContext);
}

export function ModeProvider({ children }) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [isLight, setMode] = useState(!prefersDarkMode);

    useEffect(() => {
        setMode(!prefersDarkMode);
    }, [prefersDarkMode]);

    const changeMode = () => {
        setMode(!isLight);
    };

    return (
        <ModeContext.Provider value={{ isLight, changeMode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}
