import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "owner" | "admin" | "member" | "guest";
  joinedAt: string;
}

export function useWorkspaceMembers(workspaceId?: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const res = await apiFetch<WorkspaceMember[]>(`/api/workspaces/${workspaceId}/members`);
      return res;
    },
    enabled: !!workspaceId,
  });
}

export function useRemoveWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, userId }: { workspaceId: string; userId: string }) => {
      return apiFetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
