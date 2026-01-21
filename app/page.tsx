import React from "react"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Users, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/masonic-symbol.svg" alt="Mason Credentials" width={40} height={40} />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Mason Credentials
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <Image src="/images/masonic-symbol.svg" alt="Square and Compasses" width={96} height={96} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Verify Your Masonic Credentials with Confidence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            A secure, digital platform for Freemasons to verify their membership
            and share credentials with lodges worldwide.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/signup">
              <Button size="lg">
                Register Your Credentials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Register"
              description="Create your account with your lodge information and personal details."
            />
            <FeatureCard
              icon={<FileCheck className="h-8 w-8" />}
              title="Upload Documents"
              description="Upload your dues card and membership certificate for verification."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Get Verified"
              description="Our administrators review and verify your credentials securely."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Share Anywhere"
              description="Share your verified digital credentials with any lodge worldwide."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Trusted Verification
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Our platform connects Freemasons across jurisdictions, providing a
            reliable way to verify membership status. Each credential is
            manually reviewed by our administrative team to ensure authenticity.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">51</div>
              <div className="text-sm text-muted-foreground">Grand Lodges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Secure</div>
              <div className="text-sm text-muted-foreground">Verification</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Verify Your Credentials?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join fellow Masons in creating a trusted network of verified
            credentials.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="bg-card text-card-foreground hover:bg-card/90"
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/images/masonic-symbol.svg" alt="Mason Credentials" width={24} height={24} />
            <span className="font-semibold text-foreground">
              Mason Credentials
            </span>
          </div>
          <p className="text-sm">
            Secure credential verification for Freemasons worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 bg-card rounded-lg border">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
