"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DocumentUpload } from "@/components/document-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  User as UserIcon,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Share2,
  Pencil,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  lodge_name: string;
  lodge_number: string;
  ritual_work_text: string;
  grand_lodge: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
  dues_card_image_url: string | null;
  certificate_image_url: string | null;
  letter_of_introduction_url: string | null;
  verified_at: string | null;
  admin_note: string | null;
  created_at: string;
}

interface DashboardContentProps {
  user: User;
  profile: MemberProfile | null;
}

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  VERIFIED: {
    label: "Verified",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: AlertCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

const GRAND_LODGES = [
  "Grand Lodge of British Columbia and Yukon",
  "Grand Lodge of Alberta",
  "Grand Lodge of Saskatchewan",
  "Grand Lodge of Manitoba",
  "Grand Lodge of Canada in the Province of Ontario",
  "Grand Lodge of Quebec",
  "Grand Lodge of New Brunswick",
  "Grand Lodge of Nova Scotia",
  "Grand Lodge of Prince Edward Island",
  "Grand Lodge of Newfoundland and Labrador",
  "Grand Lodge of Yukon",
  "Grand Lodge of the Northwest Territories",
  "Grand Lodge of Nunavut",
];

export function DashboardContent({ user, profile }: DashboardContentProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || "",
    lodge_name: profile?.lodge_name || "",
    lodge_number: profile?.lodge_number || "",
    grand_lodge: profile?.grand_lodge || "",
    ritual_work_text: profile?.ritual_work_text || "",
  });
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        full_name: currentProfile?.full_name || "",
        lodge_name: currentProfile?.lodge_name || "",
        lodge_number: currentProfile?.lodge_number || "",
        grand_lodge: currentProfile?.grand_lodge || "",
        ritual_work_text: currentProfile?.ritual_work_text || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!currentProfile) return;
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from("member_profiles")
      .update({
        full_name: editForm.full_name,
        lodge_name: editForm.lodge_name,
        lodge_number: editForm.lodge_number,
        grand_lodge: editForm.grand_lodge,
        ritual_work_text: editForm.ritual_work_text,
      })
      .eq("user_id", currentProfile.user_id);

    if (!error) {
      setCurrentProfile({
        ...currentProfile,
        ...editForm,
      });
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };

  const handleUploadComplete = (type: "dues_card" | "certificate" | "letter_of_introduction", url: string) => {
    if (currentProfile) {
      const fieldMap = {
        dues_card: "dues_card_image_url",
        certificate: "certificate_image_url",
        letter_of_introduction: "letter_of_introduction_url",
      };
      setCurrentProfile({
        ...currentProfile,
        [fieldMap[type]]: url,
      });
    }
  };

  const status = currentProfile?.status || "PENDING";
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/masonic-logo.png" alt="Mason Credentials" width={32} height={32} />
            <span className="text-lg font-bold text-foreground">
              Mason Credentials
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Member Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your credentials and verification status
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Verification Status</CardTitle>
              </div>
              <Badge variant={statusConfig[status].variant}>
                <StatusIcon className={`h-4 w-4 mr-1 ${statusConfig[status].color}`} />
                {statusConfig[status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* TODO: Re-enable status-based messaging when admin verification feature is added */}
            {/* {status === "PENDING" && (
              <p className="text-muted-foreground">
                Your credentials are being reviewed. Please upload your dues card
                and membership certificate to expedite the verification process.
              </p>
            )}
            {status === "REJECTED" && currentProfile?.admin_note && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-medium text-destructive mb-1">
                  Rejection Reason:
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentProfile.admin_note}
                </p>
              </div>
            )}
            {status === "SUSPENDED" && currentProfile?.admin_note && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-medium text-destructive mb-1">
                  Suspension Reason:
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentProfile.admin_note}
                </p>
              </div>
            )} */}
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Share your credentials page with other lodges for verification.
              </p>
              <Link href={`/credentials/${currentProfile?.id}`}>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  View Public Credentials
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your lodge membership details</CardDescription>
                </div>
              </div>
              {currentProfile && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleEditToggle} disabled={isSaving}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-1" />
                        )}
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentProfile ? (
              isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lodge_name">Lodge Name</Label>
                    <Input
                      id="lodge_name"
                      value={editForm.lodge_name}
                      onChange={(e) => setEditForm({ ...editForm, lodge_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lodge_number">Lodge Number</Label>
                    <Input
                      id="lodge_number"
                      value={editForm.lodge_number}
                      onChange={(e) => setEditForm({ ...editForm, lodge_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grand_lodge">Grand Lodge</Label>
                    <Select
                      value={editForm.grand_lodge}
                      onValueChange={(value) => setEditForm({ ...editForm, grand_lodge: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grand Lodge" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRAND_LODGES.map((lodge) => (
                          <SelectItem key={lodge} value={lodge}>
                            {lodge}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="ritual_work">Ritual Work</Label>
                    <Input
                      id="ritual_work"
                      value={editForm.ritual_work_text}
                      onChange={(e) => setEditForm({ ...editForm, ritual_work_text: e.target.value })}
                      placeholder="e.g., Emulation, Canadian, etc."
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-foreground">{currentProfile.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Lodge
                    </p>
                    <p className="text-foreground">
                      {currentProfile.lodge_name} #{currentProfile.lodge_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Grand Lodge
                    </p>
                    <p className="text-foreground">{currentProfile.grand_lodge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ritual Work
                    </p>
                    <p className="text-foreground">
                      {currentProfile.ritual_work_text}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <p className="text-muted-foreground">
                Profile information not found. Please contact support.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Documents</CardTitle>
            </div>
            <CardDescription>
              Upload your dues card, membership certificate, and letter of introduction for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <DocumentUpload
                type="dues_card"
                label="Dues Card"
                description="Upload a photo of your current dues card"
                currentUrl={currentProfile?.dues_card_image_url}
                onUploadComplete={(url) => handleUploadComplete("dues_card", url)}
              />
              <DocumentUpload
                type="certificate"
                label="Membership Certificate"
                description="Upload your membership certificate"
                currentUrl={currentProfile?.certificate_image_url}
                onUploadComplete={(url) => handleUploadComplete("certificate", url)}
              />
              <DocumentUpload
                type="letter_of_introduction"
                label="Letter of Introduction"
                description="Upload a letter of introduction from your lodge"
                currentUrl={currentProfile?.letter_of_introduction_url}
                onUploadComplete={(url) => handleUploadComplete("letter_of_introduction", url)}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
