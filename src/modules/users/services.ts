import { api } from "@/lib/api";

import type { User } from "@/modules/auth/types";

export interface UpdateMeInput {
  full_name: string;
}

export function updateMe(payload: UpdateMeInput) {
  return api<User>("/users/me", { method: "PUT", body: payload });
}

export function uploadMyAvatar(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<User>("/users/me/avatar", { method: "POST", body: fd });
}
