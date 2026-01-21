"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";

interface MemberProfile {
  id: string;
  full_name: string;
  lodge_name: string;
  lodge_number: string;
  ritual_work_text: string;
  grand_lodge: string;
  status: string;
  verified_at: string | null;
  dues_card_image_url: string | null;
  certificate_image_url: string | null;
  dues_paid_through?: string | null;
}

interface CredentialsCardProps {
  profile: MemberProfile;
}

export function CredentialsCard({ profile }: CredentialsCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(8 * 60); // 8 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate dues paid through date (1 year from verification or custom)
  const duesPaidThrough = profile.dues_paid_through
    ? new Date(profile.dues_paid_through).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : profile.verified_at
      ? new Date(
          new Date(profile.verified_at).setFullYear(
            new Date(profile.verified_at).getFullYear() + 1
          )
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "December 31, 2026";

  if (isExpired) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center p-8 text-center"
        style={{
          background: "linear-gradient(180deg, #1e3a5f 0%, #0f1c2e 100%)",
        }}
      >
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white mb-2 font-serif">Page Expired</h2>
        <p className="text-slate-300 font-body max-w-sm">
          This verification page has expired for security purposes. Please
          request a new link from the member.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center"
      style={{
        background: "linear-gradient(180deg, #1e3a5f 0%, #0f1c2e 100%)",
      }}
    >
      <div className="w-full max-w-md mx-auto px-6">
        {/* Page Title - Ceremonial Header */}
        <div className="pt-10 pb-6 text-center">
          <h1 
            className="text-slate-200 font-semibold uppercase font-serif"
            style={{ 
              fontSize: "24px", 
              letterSpacing: "0.18em",
              lineHeight: 1.3
            }}
          >
            Verified Masonic<br />Member
          </h1>
        </div>

        {/* Divider with Symbol */}
        <div className="flex items-center justify-center gap-4 py-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-slate-500" />
          <Image 
            src="/images/masonic-symbol.svg" 
            alt="Square and Compasses" 
            width={60} 
            height={60}
          />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-500 to-slate-500" />
        </div>

        {/* Member Name - Primary Focus (Largest) */}
        <div className="py-8 text-center">
          <h2 
            className="text-white font-bold uppercase font-serif"
            style={{ 
              fontSize: "40px", 
              letterSpacing: "0.1em",
              lineHeight: 1.15
            }}
          >
            {profile.full_name}
          </h2>
        </div>

        {/* Lodge Name + Number - Secondary */}
        <div className="pb-2 text-center">
          <p 
            className="text-slate-200 font-medium uppercase font-serif"
            style={{ 
              fontSize: "20px", 
              letterSpacing: "0.12em" 
            }}
          >
            {profile.lodge_name} #{profile.lodge_number}
          </p>
        </div>

        {/* Grand Lodge / Jurisdiction - Contextual */}
        <div className="pb-8 text-center">
          <p 
            className="text-slate-300 font-normal uppercase font-serif"
            style={{ 
              fontSize: "17px", 
              letterSpacing: "0.1em" 
            }}
          >
            {profile.grand_lodge}
          </p>
        </div>

        {/* Divider with Symbol */}
        <div className="flex items-center justify-center gap-4 py-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-slate-500" />
          <Image 
            src="/images/masonic-symbol.svg" 
            alt="Square and Compasses" 
            width={50} 
            height={50}
          />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-500 to-slate-500" />
        </div>

        {/* Metadata Section - Ritual Work & Dues Info */}
        <div className="py-6 flex justify-center gap-12 text-center">
          <div>
            <p 
              className="text-slate-400 uppercase font-medium font-body"
              style={{ 
                fontSize: "14px", 
                letterSpacing: "0.15em",
                marginBottom: "8px"
              }}
            >
              Ritual Work
            </p>
            <p 
              className="text-slate-200 font-semibold uppercase font-body"
              style={{ 
                fontSize: "18px", 
                letterSpacing: "0.06em" 
              }}
            >
              {profile.ritual_work_text}
            </p>
          </div>
          <div>
            <p 
              className="text-slate-400 uppercase font-medium font-body"
              style={{ 
                fontSize: "14px", 
                letterSpacing: "0.15em",
                marginBottom: "8px"
              }}
            >
              Dues Paid Through
            </p>
            <p 
              className="text-slate-200 font-semibold uppercase font-body"
              style={{ 
                fontSize: "18px", 
                letterSpacing: "0.06em" 
              }}
            >
              {duesPaidThrough}
            </p>
          </div>
        </div>

        {/* Action Links - Document Links */}
        <div className="py-6 text-center space-y-3">
          {profile.dues_card_image_url && (
            timeRemaining > 0 ? (
              <a
                href={profile.dues_card_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white hover:text-slate-200 uppercase transition-colors font-serif font-medium"
                style={{ 
                  fontSize: "15px", 
                  letterSpacing: "0.12em" 
                }}
              >
                Dues Card
              </a>
            ) : (
              <span 
                className="block text-slate-500 uppercase font-serif font-medium"
                style={{ 
                  fontSize: "15px", 
                  letterSpacing: "0.12em" 
                }}
              >
                Dues Card
              </span>
            )
          )}
          {profile.certificate_image_url && (
            timeRemaining > 0 ? (
              <a
                href={profile.certificate_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white hover:text-slate-200 uppercase transition-colors font-serif font-medium"
                style={{ 
                  fontSize: "15px", 
                  letterSpacing: "0.12em" 
                }}
              >
                Grand Lodge Certificate
              </a>
            ) : (
              <span 
                className="block text-slate-500 uppercase font-serif font-medium"
                style={{ 
                  fontSize: "15px", 
                  letterSpacing: "0.12em" 
                }}
              >
                Grand Lodge Certificate
              </span>
            )
          )}
        </div>

        {/* Expiry Warning */}
        <div className="py-5 text-center border-t border-slate-700/50">
          <p 
            className="text-red-400 font-medium flex items-center justify-center gap-1 font-body"
            style={{ fontSize: "12px" }}
          >
            <AlertTriangle className="h-3 w-3" />
            This page expires in {formatTime(timeRemaining)} minutes
          </p>
          {/* Footer Disclaimer */}
          <p 
            className="text-slate-500 font-normal uppercase font-body mt-2"
            style={{ 
              fontSize: "10px", 
              letterSpacing: "0.15em" 
            }}
          >
            For verification only. It cannot be downloaded or shared.
          </p>
        </div>
      </div>
    </div>
  );
}
