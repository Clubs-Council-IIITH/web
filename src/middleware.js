/**

This middleware intercepts incoming requests to apply security headers, manage access
control, and perform route-specific redirects. It performs the following tasks:

1. **Content Security Policy (CSP) Setup:**
  - Generates a unique nonce using a random UUID to secure inline scripts and styles.
  - Constructs a strict CSP header that defines allowed sources for scripts, styles, images,
    fonts, objects, and other resources. The header is adjusted based on whether the app is running
    in production or development.
  - Sets additional security headers like "X-Content-Type-Options" and "Referrer-Policy" on both
    the request and response.

2. **Route Redirection:**
  - Immediately redirects requests from "/student-bodies/clubs" to "/student-bodies/clubs-council".

3. **Access Control for Protected Routes:**
  - Checks if the current request's pathname matches any protected route defined in the ACL (imported as `routes`).
  - If the route is protected and the "Authorization" cookie is missing, the user is redirected to a login page,
    with the current pathname appended to the login URL.
  - If the user is authenticated, their JWT token (from the "Authorization" cookie) is decoded to extract user details.

4. **Club Account Specific Redirects:**
  - For routes defined in the club-specific redirects (imported as `clubRedirects`), if the authenticated user's role is "club" (the user account of a club),
    the middleware redirects them to the appropriate club-specific page.

5. **Authorization Enforcement:**
  - After validating the user's role from the decoded JWT, the middleware checks if the user's role is authorized
    to access the requested route as defined in the ACL.
  - If the user's role is not permitted, they are redirected to the homepage.

6. **Middleware Configuration:**
  - The middleware is applied to all request paths except those starting with "api", "_next/static", "_next/image",
    or "favicon.ico".
**/


import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { jwtDecode as jwt_decode } from "jwt-decode";

import routes from "acl/routes";
import clubRedirects from "acl/clubRedirects";

const redirect = (url, contentSecurityPolicyHeaderValue) => {
  const redirectRes = NextResponse.redirect(url);
  redirectRes.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );
  redirectRes.headers.set("X-Content-Type-Options", "nosniff");
  redirectRes.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return redirectRes;
};

// TODO: make multiple middlewares (one for route acl, one for club redirects) and combine them
export function middleware(req) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { pathname } = req.nextUrl;
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' 'wasm-unsafe-eval' ${
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
    contentSecurityPolicyHeaderValue,
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
    contentSecurityPolicyHeaderValue,
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // redirect to CC about page
  if (pathname === "/student-bodies/clubs") {
    return redirect(
      new URL("/student-bodies/clubs-council", req.url),
      contentSecurityPolicyHeaderValue,
    );
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
    return redirect(
      new URL(`/login${pathname}`, req.url),
      contentSecurityPolicyHeaderValue,
    );
  }

  // if logged in, extract user attributes
  const token = req.cookies.get("Authorization"); // get token from request header
  const user = jwt_decode(token?.value);

  // check if current route is to be redirected for club accounts
  const clubRedirectRoute =
    Object.keys(clubRedirects).find((r) => match(r)(pathname)) || false;

  // club account specific redirects
  if (clubRedirectRoute && user?.role === "club") {
    return redirect(
      new URL(clubRedirects[pathname], req.url),
      contentSecurityPolicyHeaderValue,
    );
  }

  // check if user has access to route
  if (!routes[protectedRoute].includes(user?.role)) {
    return redirect(new URL("/", req.url), contentSecurityPolicyHeaderValue);
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
