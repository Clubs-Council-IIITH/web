"use client";

export function login(pathname) {
  if (pathname == "/")
    pathname = "";
  // redirect to CAS login with current page as redirect URL
  window.location.replace(`/login${pathname}`);
}

export async function logout(pathname) {
  // set flag to expire token the next time someone visits the site, because CAS doesn't follow ?service for some reason
  // setCookie("logout", true);

  // fetch logout page to expire token
  await fetch("/logoutCallback");

  // redirect to CAS logout
  window.location.replace("/logout");
}
