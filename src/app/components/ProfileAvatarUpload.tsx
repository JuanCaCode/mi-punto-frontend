import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/modules/auth/types";
import { useUploadMyAvatar } from "@/modules/users/hooks";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

interface ProfileAvatarUploadProps {
  user: User;
}

export function ProfileAvatarUpload({ user }: ProfileAvatarUploadProps) {
  const upload = useUploadMyAvatar();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatar_url);

  useEffect(() => {
    setPreviewUrl(user.avatar_url);
  }, [user.avatar_url]);

  const handleFileChange = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!ACCEPTED.split(",").includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG y PNG");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("La imagen no puede superar 2 MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const updated = await upload.mutateAsync(file);
      setPreviewUrl(updated.avatar_url);
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      setPreviewUrl(user.avatar_url);
      const msg = error instanceof Error ? error.message : "No pudimos subir la foto";
      toast.error(msg);
    } finally {
      URL.revokeObjectURL(localPreview);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <Avatar className="size-24 border-2 border-blue-100">
        <AvatarImage src={previewUrl ?? undefined} alt={user.full_name} />
        <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
          {initialsFromName(user.full_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center sm:text-left space-y-2">
        <p className="text-sm font-medium text-gray-700">Foto de perfil</p>
        <p className="text-xs text-gray-500">JPG o PNG, máximo 2 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => void handleFileChange(e.target.files)}
        />
        <button
          type="button"
          disabled={upload.isPending}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition"
        >
          {upload.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {user.avatar_url ? "Cambiar foto" : "Subir foto"}
        </button>
      </div>
    </div>
  );
}
