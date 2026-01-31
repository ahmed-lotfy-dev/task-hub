import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Board } from "@taskflow/shared";

export function useBoards() {
  return useQuery({
    queryKey: ["boards", "recent"],
    queryFn: async () => {
      return apiFetch<Board[]>("/api/boards");
    },
  });
}
