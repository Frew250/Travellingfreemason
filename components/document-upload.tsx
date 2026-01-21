"use client";

import React from "react"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, Loader2, X, ExternalLink } from "lucide-react";
import Image from "next/image";

interface DocumentUploadProps {
  type: "dues_card" | "certificate";
  label: string;
  description: string;
  currentUrl: string | null | undefined;
  onUploadComplete: (url: string) => void;
}

export function DocumentUpload({
  type,
  label,
  description,
  currentUrl,
  onUploadComplete,
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    // Show preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPreviewUrl(data.url);
      onUploadComplete(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(currentUrl || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isPdf = previewUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-medium text-foreground">{label}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {previewUrl ? (
        <div className="relative border rounded-lg overflow-hidden bg-muted/50">
          {isPdf ? (
            <div className="p-6 flex flex-col items-center gap-3">
              <FileCheck className="h-12 w-12 text-primary" />
              <p className="text-sm text-muted-foreground">PDF Document</p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View Document <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div className="relative aspect-[4/3]">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt={label}
                fill
                className="object-contain"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={() => {
              setPreviewUrl(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WebP, or PDF (max 5MB)
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : previewUrl ? (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Replace Document
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </>
        )}
      </Button>
    </div>
  );
}
