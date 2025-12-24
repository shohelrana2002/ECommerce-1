import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/user/stripe/webhook")) {
    return NextResponse.next();
  }
  // Public routes
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth",
    "/api/socket/connect",
    "/api/socket/update-location",
  ];

  // Skip public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check auth token
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }
  const role = token.role;

  // unauthorized
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api/user/stripe/webhook|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
  // matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};

// socket.io|
