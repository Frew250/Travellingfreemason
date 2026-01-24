"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Search, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialId.trim()) {
      router.push(`/credentials/${credentialId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/masonic-logo.png" alt="Mason Credentials" width={32} height={32} />
            <span className="text-lg font-bold text-foreground">
              Mason Credentials
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-md">
        <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">View Member Credentials</CardTitle>
              <CardDescription>
                Enter the credential ID to view a Mason&apos;s membership credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credentialId">Credential ID</Label>
                  <Input
                    id="credentialId"
                    type="text"
                    placeholder="Enter credential ID"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  View Credentials
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  The credential ID can be found on the member&apos;s digital
                  credentials card or shared link.
                </p>
              </div>
            </CardContent>
          </Card>
      </main>
    </div>
  );
}
