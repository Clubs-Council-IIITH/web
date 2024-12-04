import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { jwtDecode as jwt_decode } from "jwt-decode";

import routes from "acl/routes";
import clubRedirects from "acl/clubRedirects";

// TODO: make multiple middlewares (one for route acl, one for club redirects) and combine them
export function middleware(req) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { pathname } = req.nextUrl;
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
    manifest-src 'self';
    style-src 'self' 'nonce-${nonce}';
    style-src-attr 'self' 'unsafe-inline';
    style-src-elem 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://uptime.betterstack.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src ${
      pathname.includes("/docs") || process.env.NODE_ENV !== "production"
        ? "http://localhost https://clubs.iiit.ac.in https://life.iiit.ac.in"
        : "https://clubs.iiit.ac.in https://life.iiit.ac.in"
    };
    frame-ancestors 'self' https://*.iiit.ac.in https://iiit.ac.in;
    connect-src 'self' https://api.iconify.design/ https://api.unisvg.com/ https://api.simplesvg.com/;
    upgrade-insecure-requests;
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // if logout cookie is set, log the user out
  if (req.cookies.has("logout")) {
    // clear logout cookie
    req.cookies.delete("logout");
    const redirectRes = NextResponse.redirect(
      new URL("/logoutCallback", req.url)
    );
    redirectRes.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    redirectRes.headers.set("X-Content-Type-Options", "nosniff");
    redirectRes.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return redirectRes;
  }

  // redirect to CC about page
  if (pathname === "/student-bodies/clubs") {
    const redirectRes = NextResponse.redirect(
      new URL("/about/clubs-council", req.url)
    );
    redirectRes.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    redirectRes.headers.set("X-Content-Type-Options", "nosniff");
    redirectRes.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return redirectRes;
  }

  // check if current route is protected
  const protectedRoute =
    Object.keys(routes).find((r) => match(r)(pathname)) || false;

  // if not, proceed to the page
  if (!protectedRoute) {
    return response;
  }

  // if protected and current user is not logged in, redirect to login page
  if (!req.cookies.has("Authorization")) {
    const redirectRes = NextResponse.redirect(
      new URL(`/login${pathname}`, req.url)
    );
    redirectRes.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    redirectRes.headers.set("X-Content-Type-Options", "nosniff");
    redirectRes.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return redirectRes;
  }

  // if logged in, extract user attributes
  const token = req.cookies.get("Authorization"); // get token from request header
  const user = jwt_decode(token?.value);

  // check if current route is to be redirected for club accounts
  const clubRedirectRoute =
    Object.keys(clubRedirects).find((r) => match(r)(pathname)) || false;

  // club account specific redirects
  if (clubRedirectRoute && user?.role === "club") {
    const redirectRes = NextResponse.redirect(
      new URL(clubRedirects[pathname], req.url)
    );
    redirectRes.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    redirectRes.headers.set("X-Content-Type-Options", "nosniff");
    redirectRes.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return redirectRes;
  }

  // check if user has access to route
  if (!routes[protectedRoute].includes(user?.role)) {
    // redirect to home page if user does not have access
    const redirectRes = NextResponse.redirect(new URL("/", req.url));
    redirectRes.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue
    );
    redirectRes.headers.set("X-Content-Type-Options", "nosniff");
    redirectRes.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return redirectRes;
  }

  // continue to page
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
