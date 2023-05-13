import { createContext, useState, useContext, useEffect, useReducer } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';

export const ModeContext = createContext({
    isLight: null,
    trackProgress: () => null,
});

export function useMode() {
    return useContext(ModeContext);
}

function reducer(state, action) {
    switch (action.type) {
        case 'true': {
            return {
                mode: true
            };
        }
        case 'false': {
            return {
                mode: false
            };
        }
    }
    throw Error('Unknown action: ' + action.type);
}

export function ModeProvider({ children }) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [state, dispatch] = useReducer(reducer, { mode: !prefersDarkMode });
    const [isLight, setIsLight] = useState(!prefersDarkMode);

    useEffect(() => {
        let theme = localStorage.getItem("cc-theme");
        if (theme != null)
            dispatch({ type: theme.toString() });
    }, []);

    const setMode = (mode) => {
        dispatch({ type: mode.toString() });
        localStorage.setItem("cc-theme", mode);
    };

    const changeMode = () => {
        setMode(!isLight);
    };

    useEffect(() => {
        setIsLight(state.mode);
    }, [state]);

    return (
        <ModeContext.Provider value={{ isLight, changeMode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}
