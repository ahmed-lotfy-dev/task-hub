import { useQuery } from "@tanstack/react-query";
import { $fetch } from "@/lib/auth-client";
import { Card as Task } from "@taskflow/shared";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks", "priority"],
    queryFn: async () => {
      const { data, error } = await $fetch<Task[]>("/api/tasks");
      if (error) throw error;
      return data;
    },
  });
}
