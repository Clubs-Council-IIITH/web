"use client";

import { setCookie } from "cookies-next";

export function login(pathname) {
  // save path to continue from
  setCookie("continue", pathname);

  // redirect to CAS login
  window.location.replace("/login");
}

export function logout(pathname) {
  // save path to continue from
  setCookie("continue", pathname);

  // set flag to expire token the next time someone visits the site, because CAS doesn't follow ?service for some reason
  setCookie("logout", true);

  // redirect to CAS logout
  window.location.replace("/logout");
}
