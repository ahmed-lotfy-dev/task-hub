"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface CreateBoardDialogProps {
  children?: React.ReactNode;
  defaultWorkspaceId?: string;
}

export function CreateBoardDialog({ children, defaultWorkspaceId }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [workspaceId, setWorkspaceId] = useState(defaultWorkspaceId || "");
  const queryClient = useQueryClient();
  const { data: workspaces } = useWorkspaces();

  const createBoardMutation = useMutation({
    mutationFn: async (data: { name: string; workspaceId: string }) => {
      return apiFetch("/api/boards", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          template: "kanban",
          visibility: "team",
        }),
      });
    },
    onSuccess: () => {
      toast.success("Board created successfully");
      setOpen(false);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create board: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !workspaceId) return;
    createBoardMutation.mutate({ name, workspaceId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Board
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Add a new board to your workspace to start organizing tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              placeholder="e.g., Marketing Campaign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select value={workspaceId} onValueChange={setWorkspaceId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces?.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createBoardMutation.isPending || !name || !workspaceId}>
              {createBoardMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
