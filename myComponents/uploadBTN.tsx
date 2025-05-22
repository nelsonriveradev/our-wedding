"use client";

import type React from "react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";

// Color palette
const palette = {
  primary: "#11270b",
  secondary: "#71b340",
  accent: "#669d31",
  accent2: "#598b2c",
  dark: "#3c5A14",
  pearl: "#F8F6F0",
};

export function UploadButton() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a photo to upload");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      toast.success("Photo uploaded successfully!");
      setOpen(false);
      setCaption("");
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          style={{
            backgroundColor: palette.primary,
            color: "#fff",
          }}
          className="hover:brightness-110"
        >
          <Camera className="w-4 h-4 mr-2" />
          Share Your Photos
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: palette.pearl,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: palette.primary }}>
            Upload a Wedding Photo
          </DialogTitle>
          <DialogDescription style={{ color: palette.dark }}>
            Share your favorite moments from our special day
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="photo" style={{ color: palette.secondary }}>
              Photo
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div
              className="relative w-full h-64 overflow-hidden rounded-md border"
              style={{ borderColor: palette.accent2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="caption" style={{ color: palette.secondary }}>
              Caption (optional)
            </Label>
            <Textarea
              id="caption"
              placeholder="Add a caption to your photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                borderColor: palette.accent,
                backgroundColor: "#fff",
                color: palette.primary,
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={uploading}
            style={{
              backgroundColor: palette.secondary,
              color: "#fff",
            }}
            className="hover:brightness-110"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
