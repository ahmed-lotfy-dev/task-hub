import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Board } from "@taskflow/shared";

export function useBoards(workspaceId?: string) {
  return useQuery({
    queryKey: ["boards", { workspaceId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workspaceId) params.append("workspaceId", workspaceId);
      return apiFetch<Board[]>(`/api/boards?${params.toString()}`);
    },
  });
}

export function useBoard(boardId?: string) {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: async () => {
      return apiFetch<Board>(`/api/boards/${boardId}`);
    },
    enabled: !!boardId,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      name: string;
      description?: string;
      visibility?: "private" | "public" | "team";
      template?: "kanban" | "scrum" | "simple" | "bug_tracker" | "blank";
    }) => {
      return apiFetch<Board>("/api/boards", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["boards", { workspaceId: variables.workspaceId }] });
    },
  });
}
