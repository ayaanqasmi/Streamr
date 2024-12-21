"use client"
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthToken from "@/hooks/useAuthToken";

export function UploadForm({
  className,
  videoDetails,
  isEditMode = false,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { 
  videoDetails?: { title?: string; description?: string; thumbnail?: File; videoFile?: File },
  isEditMode?: boolean
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(videoDetails?.title || "");
  const [description, setDescription] = useState(videoDetails?.description || "");
  const [thumbnail, setThumbnail] = useState<File | null>(videoDetails?.thumbnail || null);
  const [videoFile, setVideoFile] = useState<File | null>(videoDetails?.videoFile || null);
  const token = useAuthToken()
    
  useEffect(() => {
    if (videoDetails) {
      setTitle(videoDetails.title || "");
      setDescription(videoDetails.description || "");
      setThumbnail(videoDetails.thumbnail || null);
      setVideoFile(videoDetails.videoFile || null);
    }
  }, [videoDetails]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (videoFile) formData.append("video", videoFile);

    try {
      const response = await fetch(isEditMode ? "YOUR_UPDATE_API_ENDPOINT_HERE" : "http://localhost:8080/api/storage/upload", {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
        headers:{
          "Authorization": String(token)
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Upload successful:", await response.json());
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Video</CardTitle>
          <CardDescription>
            Fill in the details below to upload your video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  required={!thumbnail}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required={!videoFile}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Enter video description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
