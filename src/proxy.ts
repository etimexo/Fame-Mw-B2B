import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("fameme_session")?.value;
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/api/auth");

  // Redirect authenticated users away from /login
  if (sessionCookie && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to /login on protected dashboard routes
  if (
    !sessionCookie &&
    !isAuthRoute &&
    !request.nextUrl.pathname.startsWith("/api")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
