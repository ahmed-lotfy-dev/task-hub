import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { List } from "@taskflow/shared";

export function useLists(boardId?: string) {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: async () => {
      if (!boardId) return [];
      const res = await apiFetch<List[]>(`/api/lists?boardId=${boardId}`);
      return res;
    },
    enabled: !!boardId,
  });
}
