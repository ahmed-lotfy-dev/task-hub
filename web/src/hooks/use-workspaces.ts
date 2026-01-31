import { useQuery } from "@tanstack/react-query";
import { $fetch } from "@/lib/auth-client";
import { Workspace } from "@taskflow/shared";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data, error } = await $fetch<Workspace[]>("/api/workspaces");
      if (error) throw error;
      return data;
    },
  });
}
