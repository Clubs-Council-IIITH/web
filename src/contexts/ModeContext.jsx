// ModeContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const ModeContext = createContext({
  isDark: true,
  setMode: () => {},
});

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let theme_bool;
    if (typeof window !== "undefined") {
      const storedMode = window.localStorage.getItem("currentModeCC");
      if (storedMode === "false") {
        theme_bool = false;
      } else if (storedMode === "true") {
        theme_bool = true;
      } else {
        theme_bool = useMediaQuery("(prefers-color-scheme: dark)");
        console.log("theme_bool", theme_bool);
      }

      setIsDark(theme_bool);
    }
  }, []);

  const setMode = (mode) => {
    setIsDark(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentModeCC", mode);
    }
  };

  return (
    <ModeContext.Provider value={{ isDark, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
