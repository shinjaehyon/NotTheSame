import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quiz/:path*"],
};
