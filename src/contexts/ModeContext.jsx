// ModeContext.js
"use client";
import React, { createContext, useState, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const ModeContext = createContext({
  isDark: true,
  setMode: () => {},
});

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  let theme_bool;
  if (window.localStorage.getItem("currentModeCC") === "false") {
    theme_bool = false;
  } else if (window.localStorage.getItem("currentModeCC") === "true") {
    theme_bool = true;
  } else {
    theme_bool = useMediaQuery("(prefers-color-scheme: dark)");
    console.log("theme_bool", theme_bool);
  }

  const [isDark, setisDark] = useState(theme_bool);

  const setMode = (mode) => {
    setisDark(mode);
    window.localStorage.setItem("currentModeCC", mode);
  };

  return (
    <ModeContext.Provider value={{ isDark, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
