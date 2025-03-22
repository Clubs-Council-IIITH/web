/**
 * @file Middleware for handling security, access control, and route redirections.
 * @module middleware
 */

import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { jwtDecode as jwt_decode } from "jwt-decode";

import routes from "acl/routes";
import clubRedirects from "acl/clubRedirects";

/**
 * @typedef {Request} NextRequest - Represents a Next.js server request object.
 */

/**
 * Redirects a request to the specified URL while applying security headers.
 * 
 * @param {URL} url - The destination URL for redirection.
 * @param {string} contentSecurityPolicyHeaderValue - The CSP header value.
 * @returns {NextResponse} A response object with redirection and security headers.
 */
const redirect = (url, contentSecurityPolicyHeaderValue) => {
  const redirectRes = NextResponse.redirect(url);
  redirectRes.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
  redirectRes.headers.set("X-Content-Type-Options", "nosniff");
  redirectRes.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return redirectRes;
};

/**
 * Middleware function to handle request security, access control, and redirections.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} A response object allowing or redirecting the request.
 */
export function middleware(req) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { pathname } = req.nextUrl;
  
  // Define Content Security Policy (CSP)
  const cspHeader = `
    default-src 'none';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' 'wasm-unsafe-eval' ${
      process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'"
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

  // Format CSP header
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  // Set security headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
  requestHeaders.set("X-Content-Type-Options", "nosniff");
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Redirect specific routes
  if (pathname === "/student-bodies/clubs") {
    return redirect(new URL("/student-bodies/clubs-council", req.url), contentSecurityPolicyHeaderValue);
  }

  // Check if the route is protected
  const protectedRoute = Object.keys(routes).find((r) => match(r)(pathname)) || false;

  if (!protectedRoute) {
    return response;
  }

  // If protected and user is not authenticated, redirect to login
  if (!req.cookies.has("Authorization")) {
    return redirect(new URL(`/login${pathname}`, req.url), contentSecurityPolicyHeaderValue);
  }

  // Decode user token
  const token = req.cookies.get("Authorization");
  const user = jwt_decode(token?.value);

  // Handle club account specific redirects
  const clubRedirectRoute = Object.keys(clubRedirects).find((r) => match(r)(pathname)) || false;

  if (clubRedirectRoute && user?.role === "club") {
    return redirect(new URL(clubRedirects[pathname], req.url), contentSecurityPolicyHeaderValue);
  }

  // Enforce authorization based on ACL
  if (!routes[protectedRoute].includes(user?.role)) {
    return redirect(new URL("/", req.url), contentSecurityPolicyHeaderValue);
  }

  return response;
}

/**
 * Middleware configuration to exclude certain paths.
 *
 * @constant
 * @type {object}
 * @property {Array} matcher - Paths to be matched by the middleware.
 */
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
