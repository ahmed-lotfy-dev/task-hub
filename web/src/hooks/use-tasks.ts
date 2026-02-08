import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card as Task } from "@taskflow/shared";

export type TaskWithComments = Task & {
  commentCount?: number;
  assignees?: { id: string; name: string; image: string | null }[];
  labels?: { id: string; name: string; color: string }[];
};

export function useTasks(boardId?: string) {
  return useQuery({
    queryKey: ["tasks", { boardId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (boardId) params.append("boardId", boardId);
      return apiFetch<TaskWithComments[]>(`/api/tasks?${params.toString()}`);
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      boardId: string;
      listId: string;
      title: string;
      description?: string;
      position: number;
      priority?: "low" | "medium" | "high" | "critical";
    }) => {
      return apiFetch<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", { boardId: variables.boardId }] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      return apiFetch<Task>(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
