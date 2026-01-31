import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Workspace } from "@taskflow/shared";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return apiFetch<Workspace[]>("/api/workspaces");
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string; visibility?: "private" | "public" | "team" }) => {
      return apiFetch<Workspace>("/api/workspaces", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
