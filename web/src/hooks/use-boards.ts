import { useQuery } from "@tanstack/react-query";
import { $fetch } from "@/lib/auth-client";
import { Board } from "@taskflow/shared";

export function useBoards() {
  return useQuery({
    queryKey: ["boards", "recent"],
    queryFn: async () => {
      const { data, error } = await $fetch<Board[]>("/api/boards");
      if (error) throw error;
      return data;
    },
  });
}
