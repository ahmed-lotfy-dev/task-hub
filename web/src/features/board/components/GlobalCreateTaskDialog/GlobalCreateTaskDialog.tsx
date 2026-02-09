"use client";

import { useState, useEffect } from "react";
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
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface GlobalCreateTaskDialogProps {
  children?: React.ReactNode;
}

export function GlobalCreateTaskDialog({ children }: GlobalCreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [boardId, setBoardId] = useState("");
  const [listId, setListId] = useState("");

  const queryClient = useQueryClient();
  const { data: workspaces } = useWorkspaces();
  const { data: boards } = useBoards(workspaceId || undefined);
  const { data: lists } = useLists(boardId || "");

  // Reset board and list when workspace changes
  useEffect(() => {
    setBoardId("");
    setListId("");
  }, [workspaceId]);

  // Reset list when board changes
  useEffect(() => {
    setListId("");
  }, [boardId]);

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          position: 65535,
          priority: "medium",
        }),
      });
    },
    onSuccess: () => {
      toast.success("Task created successfully");
      setOpen(false);
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !boardId || !listId) return;
    createTaskMutation.mutate({ title, boardId, listId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to any of your boards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select value={workspaceId} onValueChange={setWorkspaceId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="board">Board</Label>
            <Select
              value={boardId}
              onValueChange={setBoardId}
              disabled={!workspaceId || !boards?.length}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={!workspaceId ? "Select workspace first" : "Select board"} />
              </SelectTrigger>
              <SelectContent>
                {boards?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="list">List</Label>
            <Select
              value={listId}
              onValueChange={setListId}
              disabled={!boardId || !lists?.length}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={!boardId ? "Select board first" : "Select list"} />
              </SelectTrigger>
              <SelectContent>
                {lists?.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
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
            <Button type="submit" disabled={createTaskMutation.isPending || !title || !listId}>
              {createTaskMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
