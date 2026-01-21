import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CredentialsCard } from "@/components/credentials-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CredentialsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("id", id)
    .eq("status", "VERIFIED")
    .single();

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CredentialsCard profile={profile} />
    </div>
  );
}
