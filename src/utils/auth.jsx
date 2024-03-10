"use client";

import { setCookie } from "cookies-next";

export function login(pathname) {
  // save path to continue from
  setCookie("continue", pathname);

  // redirect to CAS login
  window.location.replace("/login");
}

export async function logout(pathname) {
  // save path to continue from
  setCookie("continue", pathname);

  // set flag to expire token the next time someone visits the site, because CAS doesn't follow ?service for some reason
  // setCookie("logout", true);

  // console.log("Logging out...");

  // fetch logout page to expire token
  await fetch("/logoutCallback");

  // redirect to CAS logout
  window.location.replace("/logout");
}
