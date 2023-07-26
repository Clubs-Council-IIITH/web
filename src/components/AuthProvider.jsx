"use client";

import { createContext, useContext } from "react";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ user, children }) {
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!Object.keys(user).length }}
    >
      {children}
    </AuthContext.Provider>
  );
}
