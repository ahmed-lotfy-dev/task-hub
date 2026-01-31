import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Workspace } from "@taskflow/shared";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return apiFetch<Workspace[]>("/api/workspaces");
    },
  });
}
