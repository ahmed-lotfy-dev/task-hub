import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface BoardMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function useBoardMembers(boardId?: string) {
  return useQuery({
    queryKey: ["board-members", boardId],
    queryFn: async () => {
      if (!boardId) return [];
      const res = await apiFetch<BoardMember[]>(`/api/boards/${boardId}/members`);
      return res;
    },
    enabled: !!boardId,
  });
}
