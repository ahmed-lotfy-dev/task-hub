import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Card as Task } from "@taskflow/shared";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks", "priority"],
    queryFn: async () => {
      return apiFetch<Task[]>("/api/tasks");
    },
  });
}
