import { NextResponse, type NextRequest } from "next/server";

import { loginPathWithError } from "@/features/auth/errors";
import { createClient } from "@/lib/supabase/server";

// Google sends the user to Supabase, and Supabase sends them here with a code.
// We swap the code for a session, then go to the home page.
// The target is always a path in this app, never a URL from the query string.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) {
    // Supabase sets "error" when the user cancels at Google.
    const reason = searchParams.has("error") ? "cancelled" : "failed";
    return NextResponse.redirect(new URL(loginPathWithError(reason), origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(loginPathWithError("failed"), origin));
  }

  return NextResponse.redirect(new URL("/", origin));
}
