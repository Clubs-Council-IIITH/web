// ModeContext.js
"use client";
import React, { createContext, useState, useContext } from "react";

const ModeContext = createContext({
  isLight: true,
  setMode: () => {},
});

export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }) => {
  let theme_bool;
  if(localStorage.getItem('theme')==='false')
    {
      theme_bool=false;
    }
    else if(localStorage.getItem('theme')==='true'){
      theme_bool=true;
    }
  const [isLight, setIsLight] = useState(theme_bool);

  const setMode = (mode) => {
    setIsLight(mode);
  };

  return (
    <ModeContext.Provider value={{ isLight, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
