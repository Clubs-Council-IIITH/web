import { createContext, useState, useContext } from "react";

export const ModeContext = createContext({
    isLight: true,
    trackProgress: () => null,
});

export function useMode() {
    return useContext(ModeContext);
}

export function ModeProvider({ children }) {
    const [isLight, setIsLight] = useState(true);

    const changeMode = () => {
        setIsLight(!isLight);
    };

    const setMode = (mode) => {
        setIsLight(mode);
    }

    return (
        <ModeContext.Provider value={{ isLight, changeMode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}
