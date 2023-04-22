import { NextResponse } from "next/server";
import { match } from "path-to-regexp";
import jwt_decode from "jwt-decode";

import routes from "acl/routes";

export function middleware(req) {
    // check if current route is protected
    const protectedRoute = Object.keys(routes).find((r) => match(r)(req.nextUrl.pathname)) || false;

    // if not, proceed to the page
    if (!protectedRoute) {
        return NextResponse.next();
    }

    // if protected and current user is not logged in, redirect to login page
    if (!req.cookies.has("Authorization")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // if logged in, check if user has access
    const token = req.cookies.get("Authorization"); // get token from request header
    const user = jwt_decode(token?.value);
    if (routes[protectedRoute].includes(user?.role)) {
        return NextResponse.next();
    }

    // redirect to home page if user does not have access
    return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
    matcher: Object.keys(routes),
};
