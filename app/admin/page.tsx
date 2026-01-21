import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.role === "admin";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all member profiles for admin
  const { data: profiles } = await supabase
    .from("member_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboard user={user} profiles={profiles || []} />;
}
