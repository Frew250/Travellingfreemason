import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect based on the type of auth action
      if (type === "recovery") {
        // Password reset flow - redirect to reset password page
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      // Email confirmation or other flows - redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error or no code, redirect to an error page or login
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
