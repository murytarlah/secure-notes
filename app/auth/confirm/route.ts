import { NextResponse, type NextRequest } from "next/server";

/**
 * Where the link in the confirmation email lands.
 *
 * By the time the tutor gets here, Supabase has already confirmed the email
 * (or found the link expired or used). We don't log them in from the link:
 * the email may be opened on a different device. We send them to the login
 * page with a message, and they log in with their password as usual.
 */
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const failed = searchParams.has("error") || searchParams.has("error_code");

  const target = failed ? "/login?confirm=failed" : "/login?confirm=ok";
  return NextResponse.redirect(new URL(target, request.url));
}
