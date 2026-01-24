"use client";

import { useState, useEffect } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberReviewModal } from "@/components/member-review-modal";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  lodge_name: string;
  lodge_number: string;
  ritual_work_text: string;
  rank: string | null;
  grand_lodge: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
  dues_card_image_url: string | null;
  certificate_image_url: string | null;
  letter_of_introduction_url: string | null;
  verified_at: string | null;
  verified_by: string | null;
  admin_note: string | null;
  created_at: string;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  VERIFIED: {
    label: "Confirmed",
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
    color: "text-orange-600",
  },
};

export function AdminDashboard() {
  const [profiles, setProfiles] = useState<MemberProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MemberProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminId(user.id);
      }
      
      const { data: profilesData } = await supabase
        .from("member_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (profilesData) {
        setProfiles(profilesData);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [supabase]);

  const handleReview = (profile: MemberProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (updatedProfile: MemberProfile) => {
    setProfiles(
      profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const pendingProfiles = profiles.filter((p) => p.status === "PENDING");
  const verifiedProfiles = profiles.filter((p) => p.status === "VERIFIED");
  const rejectedProfiles = profiles.filter((p) => p.status === "REJECTED");
  const suspendedProfiles = profiles.filter((p) => p.status === "SUSPENDED");

  const stats = [
    { label: "Total Members", value: profiles.length, icon: Users },
    { label: "Pending Review", value: pendingProfiles.length, icon: Clock },
    { label: "Confirmed", value: verifiedProfiles.length, icon: CheckCircle },
    { label: "Rejected/Suspended", value: rejectedProfiles.length + suspendedProfiles.length, icon: XCircle },
  ];

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Member Confirmation
          </h1>
          <p className="text-muted-foreground">
            Review and manage member credential confirmation requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingProfiles.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {pendingProfiles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified">Confirmed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ProfileList
              profiles={pendingProfiles}
              onReview={handleReview}
              emptyMessage="No pending confirmation requests"
            />
          </TabsContent>

          <TabsContent value="verified">
            <ProfileList
              profiles={verifiedProfiles}
              onReview={handleReview}
              emptyMessage="No confirmed members yet"
            />
          </TabsContent>

          <TabsContent value="rejected">
            <ProfileList
              profiles={[...rejectedProfiles, ...suspendedProfiles]}
              onReview={handleReview}
              emptyMessage="No rejected or suspended members"
            />
          </TabsContent>

          <TabsContent value="all">
            <ProfileList
              profiles={profiles}
              onReview={handleReview}
              emptyMessage="No members found"
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Modal */}
      {selectedProfile && (
        <MemberReviewModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProfile(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          adminId={adminId}
        />
      )}
    </main>
  );
}

function ProfileList({
  profiles,
  onReview,
  emptyMessage,
}: {
  profiles: MemberProfile[];
  onReview: (profile: MemberProfile) => void;
  emptyMessage: string;
}) {
  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => {
        const StatusIcon = statusConfig[profile.status].icon;
        return (
          <Card key={profile.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                  <CardDescription>
                    {profile.lodge_name} #{profile.lodge_number}
                  </CardDescription>
                </div>
                <Badge variant={statusConfig[profile.status].variant}>
                  <StatusIcon
                    className={`h-3 w-3 mr-1 ${statusConfig[profile.status].color}`}
                  />
                  {statusConfig[profile.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Grand Lodge</p>
                    <p className="font-medium text-foreground truncate">
                      {profile.grand_lodge}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    {profile.dues_card_image_url && (
                      <Badge variant="outline" className="text-xs">
                        Dues Card
                      </Badge>
                    )}
                    {profile.certificate_image_url && (
                      <Badge variant="outline" className="text-xs">
                        Certificate
                      </Badge>
                    )}
                    {profile.letter_of_introduction_url && (
                      <Badge variant="outline" className="text-xs">
                        Letter
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" onClick={() => onReview(profile)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
