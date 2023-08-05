import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import jwt_decode from "jwt-decode";

import routes from "acl/routes";
import clubRedirects from "acl/clubRedirects";

// TODO: make multiple middlewares (one for route acl, one for club redirects) and combine them
export function middleware(req) {
  // redirect to CC about page
  if (req.nextUrl.pathname === "/student-bodies/clubs") {
    return NextResponse.redirect(new URL("/about/clubs-council", req.url));
  }

  // check if current route is protected
  const protectedRoute =
    Object.keys(routes).find((r) => match(r)(req.nextUrl.pathname)) || false;

  // if not, proceed to the page
  if (!protectedRoute) {
    return NextResponse.next();
  }

  // if protected and current user is not logged in, redirect to login page
  if (!req.cookies.has("Authorization")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // if logged in, extract user attributes
  const token = req.cookies.get("Authorization"); // get token from request header
  const user = jwt_decode(token?.value);

  // check if current route is to be redirected for club accounts
  const clubRedirectRoute =
    Object.keys(clubRedirects).find((r) => match(r)(req.nextUrl.pathname)) ||
    false;

  // club account specific redirects
  if (clubRedirectRoute && user?.role === "club") {
    return NextResponse.redirect(
      new URL(clubRedirects[req.nextUrl.pathname], req.url)
    );
  }

  // check if user has access to route
  if (!routes[protectedRoute].includes(user?.role)) {
    // redirect to home page if user does not have access
    return NextResponse.redirect(new URL("/", req.url));
  }

  // continue to page
  return NextResponse.next();
}
