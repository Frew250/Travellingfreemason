import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  
  const { email, password, fullName, lodgeName, lodgeNumber, ritualWorkText, grandLodge } = await request.json();

  // First create the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${request.headers.get('origin')}/dashboard`,
      data: {
        full_name: fullName,
        role: "member",
      },
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (!authData.user) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
  }

  // Use the admin client to bypass RLS for profile creation
  const { error: profileError } = await adminClient
    .from("member_profiles")
    .insert({
      user_id: authData.user.id,
      full_name: fullName,
      lodge_name: lodgeName,
      lodge_number: lodgeNumber,
      ritual_work_text: ritualWorkText,
      grand_lodge: grandLodge,
      status: "PENDING",
    });

  if (profileError) {
    // If profile creation fails, delete the auth user to keep data consistent
    await adminClient.auth.admin.deleteUser(authData.user.id);
    console.error("Profile creation error:", profileError);
    
    // Check for specific database errors and return user-friendly messages
    let userFriendlyMessage = "Failed to create profile. Please try again.";
    
    if (profileError.code === "23505" || profileError.message.includes("duplicate") || profileError.message.includes("already exists")) {
      userFriendlyMessage = "An account with these details already exists. Please sign in instead or use different information.";
    } else if (profileError.code === "23503" || profileError.message.includes("foreign key") || profileError.message.includes("violates foreign key constraint")) {
      userFriendlyMessage = "An account with this email address already exists. Please sign in or use a different email.";
    }
    
    return NextResponse.json({ error: userFriendlyMessage }, { status: 400 });
  }

  return NextResponse.json({ 
    success: true, 
    message: "Account created successfully. Please check your email to verify your account.",
    email: authData.user.email 
  });
}
