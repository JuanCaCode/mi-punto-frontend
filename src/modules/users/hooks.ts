import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { currentUserAtom } from "@/modules/auth/atoms";
import type { User } from "@/modules/auth/types";

import { type UpdateMeInput, updateMe, uploadMyAvatar } from "./services";

function syncCurrentUser(
  user: User,
  setCurrentUser: (user: User) => void,
  qc: ReturnType<typeof useQueryClient>,
) {
  setCurrentUser(user);
  qc.invalidateQueries({ queryKey: ["auth", "me"] });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  return useMutation<User, Error, UpdateMeInput>({
    mutationFn: updateMe,
    onSuccess: (user) => syncCurrentUser(user, setCurrentUser, qc),
  });
}

export function useUploadMyAvatar() {
  const qc = useQueryClient();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  return useMutation<User, Error, File>({
    mutationFn: uploadMyAvatar,
    onSuccess: (user) => syncCurrentUser(user, setCurrentUser, qc),
  });
}
