import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_PARAM, hasAccess } from "@/lib/access";

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const given = nextUrl.searchParams.get(ACCESS_PARAM);

  if (given !== null) {
    const target = nextUrl.clone();
    target.searchParams.delete(ACCESS_PARAM);
    if (!hasAccess(given)) {
      target.pathname = "/wejscie";
      target.searchParams.set("blad", "1");
      return NextResponse.redirect(target);
    }
    if (target.pathname === "/wejscie") target.pathname = "/";
    const response = NextResponse.redirect(target);
    response.cookies.set(ACCESS_COOKIE, given, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return response;
  }

  if (nextUrl.pathname === "/wejscie" || hasAccess(request.cookies.get(ACCESS_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const login = nextUrl.clone();
  login.pathname = "/wejscie";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
