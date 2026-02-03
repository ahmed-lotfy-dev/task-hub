import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useLists } from "@/hooks/use-lists";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { useBoards } from "@/hooks/use-boards";

export function useTaskDetail(taskId: string | null) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { boardId } = useParams({ strict: false });
  const { data: boards } = useBoards();
  const { data: lists } = useLists(boardId);

  const board = boards?.find(b => b.id === boardId);

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("medium");

  const { data: task, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      console.log(`[Frontend] Fetching task detail for ID: ${taskId}`);
      if (!taskId) return null;
      return apiFetch<any>(`/api/tasks/${taskId}`);
    },
    enabled: !!taskId,
  });

  const list = lists?.find(l => l.id === task?.listId);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
    }
  }, [task]);

  const updateTaskMutation = useMutation({
    mutationFn: async (json: any) => {
      if (!taskId) return;
      return apiFetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(json),
      });
    },
    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      if (!taskId) return;
      return apiFetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { data: candidates } = useQuery({
    queryKey: ["candidates", boardId],
    queryFn: async () => {
      if (!boardId) return [];
      return apiFetch<any[]>(`/api/members/candidates?boardId=${boardId}`);
    },
    enabled: !!boardId,
  });

  const assignUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log(`[Mutation] assignUserMutation triggered for taskId: ${taskId}, userId: ${userId}`);
      if (!taskId) {
        console.error("[Mutation] taskId is missing!");
        return;
      }
      return apiFetch(`/api/tasks/${taskId}/assignees`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
    },
    onSuccess: (data) => {
      console.log("[Mutation] assignUserMutation onSuccess", data);
      toast.success(`Assigned user successfully`);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", { boardId }] });
    },
    onError: (error: any) => {
      console.error("[Mutation] assignUserMutation onError", error);
      toast.error("Failed to assign user: " + error.message);
    },
  });

  const unassignUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!taskId) return;
      return apiFetch(`/api/tasks/${taskId}/assignees/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: (_, userId) => {
      toast.success(`Unassigned user ${userId}`);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", { boardId }] });
    },
    onError: (error: any) => {
      toast.error("Failed to unassign user: " + error.message);
    },
  });

  return {
    task,
    isLoadingTask,
    lists,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    candidates,
    session,
    boardName: board?.name,
    listName: list?.name,
    updateTaskMutation,
    deleteTaskMutation,
    assignUserMutation,
    unassignUserMutation,
  };
}
