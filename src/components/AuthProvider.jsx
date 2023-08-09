"use client";

import { hasCookie } from "cookies-next";

import { createContext, useContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ user, children }) {
  const value = {
    user: hasCookie("logout") ? null : user,
    isAuthenticated: hasCookie("logout") ? false : !!Object.keys(user).length,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
