// ModeContext.js
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const ModeContext = createContext({
  isDark: true,
  setMode: () => {},
});

const iframeContext = createContext({
  isiframe: false,
  setMode: () => {},
});

const GradientCircularLoader = ({ size = 50, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          animation: "spin 1.5s linear infinite",
          transformOrigin: "50% 50%",
        }}
      >
        <defs>
          <linearGradient
            id="gradient-loader"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient-loader)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25} // Creates the gap in the circle
        />
      </svg>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        svg {
          display: block;
          animation-delay: -1500ms;
        }
      `}</style>
    </div>
  );
};

export const useMode = () => useContext(ModeContext);
export const useMode2 = () => useContext(iframeContext);

export const ModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isiframe, setIsiframe] = useState(false);
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

    if (window.self !== window.top) {
      setIsiframe(true);
      setIsDark(false);
    } else {
      setIsiframe(false);
    }
  }, [theme_bool]);

  const setMode = (mode) => {
    setIsDark(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentModeCC", mode);
    }
  };

  return (
    <iframeContext.Provider value={{ isiframe, setMode }}>
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
            <GradientCircularLoader />
          </div>
        ) : (
          children
        )}
      </ModeContext.Provider>
    </iframeContext.Provider>
  );
};
