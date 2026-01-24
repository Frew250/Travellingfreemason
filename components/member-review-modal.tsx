"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import Image from "next/image";

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

interface MemberReviewModalProps {
  profile: MemberProfile;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (profile: MemberProfile) => void;
  adminId: string;
}

export function MemberReviewModal({
  profile,
  isOpen,
  onClose,
  onStatusUpdate,
  adminId,
}: MemberReviewModalProps) {
  const [adminNote, setAdminNote] = useState(profile.admin_note || "");
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleStatusChange = async (
    newStatus: "VERIFIED" | "REJECTED" | "SUSPENDED"
  ) => {
    setLoading(newStatus);

    const updateData: Record<string, unknown> = {
      status: newStatus,
      admin_note: adminNote || null,
      verified_by: adminId,
      verified_at: newStatus === "VERIFIED" ? new Date().toISOString() : null,
    };

    const { error } = await supabase
      .from("member_profiles")
      .update(updateData)
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating status:", error);
      setLoading(null);
      return;
    }

    onStatusUpdate({
      ...profile,
      status: newStatus,
      admin_note: adminNote || null,
      verified_by: adminId,
      verified_at: newStatus === "VERIFIED" ? new Date().toISOString() : null,
    });
    setLoading(null);
  };

  const isPdf = (url: string | null) => url?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Member Application</DialogTitle>
          <DialogDescription>
            Review the submitted documents and confirm or reject this
            member&apos;s credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Member Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Rank</p>
                <p className="font-medium text-foreground">{profile.rank || "Not specified"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lodge</p>
                <p className="font-medium text-foreground">
                  {profile.lodge_name} #{profile.lodge_number}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Grand Lodge</p>
                <p className="font-medium text-foreground">{profile.grand_lodge}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ritual Work</p>
                <p className="font-medium text-foreground">
                  {profile.ritual_work_text}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium text-foreground">
                  {new Date(profile.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Status</p>
                <Badge
                  variant={
                    profile.status === "VERIFIED"
                      ? "default"
                      : profile.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {profile.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Submitted Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dues Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 border-b">
                  <p className="text-sm font-medium text-foreground">Dues Card</p>
                </div>
                {profile.dues_card_image_url ? (
                  isPdf(profile.dues_card_image_url) ? (
                    <div className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <a
                        href={profile.dues_card_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        View PDF <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <a
                      href={profile.dues_card_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={profile.dues_card_image_url || "/placeholder.svg"}
                          alt="Dues Card"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </a>
                  )
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Not uploaded
                  </div>
                )}
              </div>

              {/* Certificate */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 border-b">
                  <p className="text-sm font-medium text-foreground">
                    Membership Certificate
                  </p>
                </div>
                {profile.certificate_image_url ? (
                  isPdf(profile.certificate_image_url) ? (
                    <div className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <a
                        href={profile.certificate_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        View PDF <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <a
                      href={profile.certificate_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={profile.certificate_image_url || "/placeholder.svg"}
                          alt="Certificate"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </a>
                  )
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Not uploaded
                  </div>
                )}
              </div>

              {/* Letter of Introduction */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 border-b">
                  <p className="text-sm font-medium text-foreground">
                    Letter of Introduction
                  </p>
                </div>
                {profile.letter_of_introduction_url ? (
                  isPdf(profile.letter_of_introduction_url) ? (
                    <div className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <a
                        href={profile.letter_of_introduction_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        View PDF <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <a
                      href={profile.letter_of_introduction_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={profile.letter_of_introduction_url || "/placeholder.svg"}
                          alt="Letter of Introduction"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </a>
                  )
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Not uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="space-y-2">
            <Label htmlFor="adminNote">Admin Note (optional)</Label>
            <Textarea
              id="adminNote"
              placeholder="Add a note (required for rejection/suspension)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={() => handleStatusChange("VERIFIED")}
              disabled={loading !== null}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading === "VERIFIED" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm Member
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("REJECTED")}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === "REJECTED" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusChange("SUSPENDED")}
              disabled={loading !== null}
              className="flex-1"
            >
              {loading === "SUSPENDED" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              Suspend
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
