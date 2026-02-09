"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateWorkspaceFormProps {
  onSuccess: () => void;
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const createWorkspaceMutation = useMutation({
    mutationFn: async (workspaceName: string) => {
      return apiFetch("/api/workspaces", {
        method: "POST",
        body: JSON.stringify({
          name: workspaceName,
          slug: workspaceName.toLowerCase().replace(/\s+/g, "-"),
        }),
      });
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create workspace: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWorkspaceMutation.mutate(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input
          id="name"
          placeholder="e.g., Marketing Team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          disabled={createWorkspaceMutation.isPending}
        />
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <Button
          type="submit"
          disabled={createWorkspaceMutation.isPending || !name.trim()}
        >
          {createWorkspaceMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Workspace
        </Button>
      </div>
    </form>
  );
}
