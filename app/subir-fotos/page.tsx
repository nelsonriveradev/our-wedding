"use client";

import type React from "react";
import { createFeedItem, FeedItem } from "../actions/feedCreation";
import { storage } from "@/lib/firebase";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
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
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Upload,
  X,
  ImagePlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, signOutUser } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { SignOutButton } from "@/myComponents/SignOutBtn";
import { PhotoGrid } from "@/myComponents/PhotoGrid";

type UploadFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "error" | "success";
  error?: string;
};

export default function MultiPhotoUpload() {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  // const [fileUrl, setFileURL] = useState<string>();
  const [overallProgress, setOverallProgress] = useState(0);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  //user data
  const user = auth.currentUser;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/heic"];

  useEffect(() => {
    if (!user) {
      router.push("/acceder");
    }
  }, [user, router]);
  // ...existing code...

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    addFiles(Array.from(selectedFiles));
  };

  const addFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles
      .map((file) => {
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name} no es un formato de imagen compatible`);
          return null;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} excede el límite de tamaño de 5MB`);
          return null;
        }

        return {
          id: `${file.name}-${Date.now()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending" as const,
        };
      })
      .filter(Boolean) as UploadFile[];

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add("border-amber-500", "bg-amber-50");
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("border-amber-500", "bg-amber-50");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (dropzoneRef.current) {
        dropzoneRef.current.classList.remove("border-amber-500", "bg-amber-50");
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(Array.from(e.dataTransfer.files));
      }
    },
    [addFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id);
      return updatedFiles;
    });
  };

  const handleAllUploadsAttempted = (
    successfulDbWrites: number,
    totalFiles: number
  ) => {
    setUploading(false);
    if (totalFiles === 0) return; // No files were processed

    if (successfulDbWrites === totalFiles) {
      toast.success("¡Todas las fotos se subieron y guardaron exitosamente!");
      setTimeout(() => {
        setOpen(false); // Close the dialog
        // Clean up previews after successful upload and dialog close
        files.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
        setFiles([]);
        setCaption("");
        setOverallProgress(0);
      }, 1000);
    } else {
      toast.error(
        "Algunas fotos no se pudieron subir o guardar correctamente."
      );
      // Consider not clearing files here so user can see errors and retry
    }
  };

  const simulateUpload = () => {
    if (files.length === 0) {
      toast.error("Por favor selecciona al menos una foto para subir");
      return;
    }

    const filesToUpload = files.filter((f) => f.status !== "success");

    if (filesToUpload.length === 0) {
      toast.info(
        "Todas las fotos seleccionadas ya han sido subidas y guardadas."
      );
      // Optionally close dialog if all are already done and user clicks upload again
      // if (files.every(f => f.status === "success")) {
      //   setOpen(false);
      // }
      return;
    }

    setUploading(true);
    // Recalculate overall progress based on current state of all files
    const initialProgressSum = files.reduce(
      (acc, f) => acc + (f.status === "success" ? 100 : f.progress),
      0
    );
    if (files.length > 0) {
      setOverallProgress(Math.round(initialProgressSum / files.length));
    } else {
      setOverallProgress(0);
    }

    let completedDbWrites = files.filter((f) => f.status === "success").length;
    let attemptedCompletions = files.filter(
      (f) => f.status === "success"
    ).length;
    const totalFilesToProcessThisRun = filesToUpload.length; // Only count files not yet successful

    if (totalFilesToProcessThisRun === 0 && files.length > 0) {
      // This case means all files were already 'success', handled by the check above.
      setUploading(false); // Ensure uploading is false if we somehow reach here.
      handleAllUploadsAttempted(completedDbWrites, files.length);
      return;
    }

    for (const file of filesToUpload) {
      // Double check status, though filesToUpload should only contain non-success files
      if (file.status === "success") {
        continue;
      }

      const storageRef = ref(
        storage,
        `uploads/${user?.uid || "unknown_user"}/${file.id}-${file.file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file.file, {
        contentType: file.file.type,
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id ? { ...f, progress, status: "uploading" } : f
            )
          );

          // Update overall progress based on all files
          setFiles((currentFiles) => {
            const totalProgressSum = currentFiles.reduce((acc, f_inner) => {
              if (f_inner.status === "success") return acc + 100;
              // For the current file being uploaded, use its latest snapshot progress
              if (f_inner.id === file.id && f_inner.status === "uploading")
                return acc + progress;
              // For other uploading files, use their stored progress
              if (f_inner.status === "uploading") return acc + f_inner.progress;
              return acc; // pending or error files contribute 0 to active progress sum
            }, 0);
            if (files.length > 0) {
              // Use files.length for overall percentage of all selected files
              setOverallProgress(Math.round(totalProgressSum / files.length));
            }
            return currentFiles;
          });
        },
        (error) => {
          console.error("Upload error for file:", file.file.name, error);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "error",
                    error: "La subida falló. Inténtalo nuevamente.",
                  }
                : f
            )
          );
          attemptedCompletions++;
          if (attemptedCompletions === files.length) {
            // Check against total files selected
            handleAllUploadsAttempted(completedDbWrites, files.length);
          }
        },
        async () => {
          // On success of storage upload
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Archivo disponible en:", downloadURL);

            const itemPayload: Omit<FeedItem, "id" | "createdAt"> & {
              createdAt: Timestamp;
            } = {
              // Adjust type if createFeedItem handles ID
              userName: user?.displayName ?? "usuario desconocido",
              userProfileImage: user?.photoURL ?? "",
              userId: user?.uid ?? "unknown-user",
              caption: caption,
              fileUrl: downloadURL,
              fileType: file.file.type || "image/jpeg", // Default or actual
              createdAt: Timestamp.now(), // Generate timestamp here
            };

            await createFeedItem({
              userName: itemPayload.userName,
              userProfileImage: itemPayload.userProfileImage,
              userId: itemPayload.userId ?? "unknown-user",
              caption: itemPayload.caption,
              fileUrl: itemPayload.fileUrl,
              fileType: itemPayload.fileType,
            }); // Ensure userId is always a string
            console.log("Feed item created for:", downloadURL);

            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === file.id
                  ? { ...f, status: "success", progress: 100 }
                  : f
              )
            );
            completedDbWrites++;
          } catch (dbError) {
            console.error(
              "Error creating feed item for",
              file.file.name,
              dbError
            );
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.id === file.id
                  ? {
                      ...f,
                      status: "error",
                      error: "Error al guardar en la base de datos.",
                    }
                  : f
              )
            );
          } finally {
            attemptedCompletions++;
            if (attemptedCompletions === files.length) {
              // Check against total files selected
              handleAllUploadsAttempted(completedDbWrites, files.length);
            }
          }
        }
      );
    } // End of for...of loop for filesToUpload

    // This final block for createFeedItem is removed as it's handled per file:
    // const item = {
    //   userId: user?.uid || "unknown-user",
    //   caption: caption,
    //   fileUrl: fileUrl || "",
    //   fileType: "imagen",
    // };
    // createFeedItem(item);
  };

  const retryFailedUploads = () => {
    const failedFiles = files.filter((file) => file.status === "error");

    if (failedFiles.length === 0) return;

    setFiles((prev) =>
      prev.map((file) =>
        file.status === "error"
          ? { ...file, status: "pending", progress: 0 }
          : file
      )
    );

    simulateUpload();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Clean up object URLs when dialog closes
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
      setFiles([]);
      setCaption("");
    }
    setOpen(newOpen);
  };
  async function handleSignOut() {
    try {
      await signOutUser();
      router.push("/acceder");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div className="w-full h-screen bg-[#F8F6F0]">
      <div className="">
        <div className="flex items-center justify-center gap-x-2">
          <SignOutButton onSignOut={handleSignOut} />
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <h1 className="text-3xl font-bold text-[#11270b]">
            Bienvenido a Nuestro Álbum de Boda
          </h1>
          <p className="text-lg text-[#669d31]">
            ¡Sube y comparte tus momentos favoritos de nuestro día especial!
          </p>
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="mx-auto bg-[#71b340] hover:bg-[#598b2c]">
                <ImagePlus className="w-4 h-4 mr-2" />
                Subir Múltiples Fotos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Subir Fotos de la Boda</DialogTitle>
                <DialogDescription>
                  Comparte múltiples fotos de nuestro día especial
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Dropzone */}
                <div
                  ref={dropzoneRef}
                  className={cn(
                    "border-2 border-dashed border-[#71b340] rounded-lg p-6 transition-colors",
                    "flex flex-col items-center justify-center text-center",
                    files.length > 0 ? "h-32" : "h-48"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-10 h-10 mb-3 text-[#71b340]" />
                  <p className="mb-2 text-sm font-medium text-[#11270b]">
                    Arrastra fotos aquí o haz clic para buscar
                  </p>
                  <p className="text-xs text-[#669d31]">
                    Soporta JPG, PNG, HEIC • Máx 10MB por foto
                  </p>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>

                {/* Overall progress */}
                {uploading && files.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso general</span>
                      <span>{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>
                )}

                {/* File previews */}
                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-[#11270b]">
                      {files.length} foto{files.length !== 1 ? "s" : ""}{" "}
                      seleccionada{files.length !== 1 ? "s" : ""}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-start gap-3 bg-white p-2 rounded-md border border-[#71b340]"
                        >
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={file.preview || "/placeholder.svg"}
                              alt={file.file.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p
                                className="text-sm font-medium text-[#11270b] truncate"
                                title={file.file.name}
                              >
                                {file.file.name}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-[#71b340] hover:text-[#598b2c]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(file.id);
                                }}
                                disabled={uploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-[#669d31]">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>

                            {file.status === "uploading" && (
                              <div className="mt-1 space-y-1">
                                <Progress
                                  value={file.progress}
                                  className="h-1.5"
                                />
                                <p className="text-xs text-[#669d31]">
                                  {file.progress}%
                                </p>
                              </div>
                            )}

                            {file.status === "error" && (
                              <div className="mt-1 flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                <p className="text-xs">{file.error}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 px-1.5 text-xs text-[#71b340]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFiles((prev) =>
                                      prev.map((f) =>
                                        f.id === file.id
                                          ? {
                                              ...f,
                                              status: "pending",
                                              progress: 0,
                                            }
                                          : f
                                      )
                                    );
                                  }}
                                >
                                  Reintentar
                                </Button>
                              </div>
                            )}

                            {file.status === "success" && (
                              <div className="mt-1 flex items-center gap-1 text-green-500">
                                <CheckCircle2 className="h-3 w-3" />
                                <p className="text-xs">Subido exitosamente</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div className="grid gap-2">
                  <Label htmlFor="caption">Descripción (opcional)</Label>
                  <Textarea
                    id="caption"
                    placeholder="Añade una descripción a tus fotos..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    disabled={uploading}
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {files.some((file) => file.status === "error") && (
                  <Button
                    variant="outline"
                    onClick={retryFailedUploads}
                    disabled={uploading}
                    className="w-full sm:w-auto"
                  >
                    Reintentar Subidas Fallidas
                  </Button>
                )}
                <Button
                  type="submit"
                  onClick={simulateUpload}
                  disabled={uploading || files.length === 0}
                  className="bg-[#71b340] hover:bg-[#598b2c] w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Subiendo..." : "Subir Fotos"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <PhotoGrid />
      </div>
    </div>
  );
}
