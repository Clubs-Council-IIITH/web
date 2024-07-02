// ModeContext.js
"use client";
import React, { createContext, useState, useContext } from "react";

const ModeContext = createContext({
  isDark: true,
  setMode: () => {},
});

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  let theme_bool;
  if(localStorage.getItem('dark')==='false')
    {
      theme_bool=false;
    }
    else if(localStorage.getItem('dark')==='true'){
      theme_bool=true;
    }
  const [isDark, setisDark] = useState(theme_bool);

  const setMode = (mode) => {
    setisDark(mode);
  };

  return (
    <ModeContext.Provider value={{ isDark, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
