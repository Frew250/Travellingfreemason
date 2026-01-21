import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";

export default function CredentialsNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/masonic-symbol.svg" alt="Mason Credentials" width={32} height={32} />
            <span className="text-lg font-bold text-foreground">
              Mason Credentials
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Credentials Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The credentials you are looking for could not be found. This may be
            because the member has not been verified yet, or the credential ID is
            incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/verify">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
