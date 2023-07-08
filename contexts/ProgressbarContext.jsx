import { createContext, useState, useContext, useRef } from "react";

export const ProgressbarContext = createContext({
  ref: null,
  trackProgress: () => null,
});

export function useProgressbar() {
  return useContext(ProgressbarContext);
}

export function ProgressbarProvider({ children }) {
  const ref = useRef(null);

  const trackProgress = (loading) => {
    if (loading) {
      ref?.current?.continuousStart();
    } else {
      ref?.current?.complete();
    }
  };

  return (
    <ProgressbarContext.Provider value={{ ref, trackProgress }}>
      {children}
    </ProgressbarContext.Provider>
  );
}
