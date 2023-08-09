"use client";

import cookieCutter from "cookie-cutter";

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
    user: cookieCutter.get("logout") ? null : user,
    isAuthenticated: cookieCutter.get("logout")
      ? false
      : !!Object.keys(user).length,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
