import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      return apiFetch<Activity[]>("/api/activities");
    },
  });
}
