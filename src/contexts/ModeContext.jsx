// ModeContext.js
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const ModeContext = createContext({
  isDark: true,
  setMode: () => {},
});

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let theme_bool = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMode = window.localStorage.getItem("currentModeCC");
      if (storedMode === "false") {
        theme_bool = false;
      } else if (storedMode === "true") {
        theme_bool = true;
      }
      setIsDark(theme_bool);
      setIsLoading(false);
    }
  }, [theme_bool]);

  const setMode = (mode) => {
    setIsDark(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentModeCC", mode);
    }
  };

  return (
    <ModeContext.Provider value={{ isDark, setMode }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <GradientCircularProgress />
        </div>
      ) : (
        children
      )}
    </ModeContext.Provider>
  );
};
