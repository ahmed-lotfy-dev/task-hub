"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

interface BoardSettingsDialogProps {
  boardId: string;
  boardName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoardSettingsDialog({ boardId, boardName, open, onOpenChange }: BoardSettingsDialogProps) {
  const [name, setName] = useState(boardName);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateBoardMutation = useMutation({
    mutationFn: async (newName: string) => {
      return apiFetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: newName }),
      });
    },
    onSuccess: () => {
      toast.success("Board updated");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update board");
    }
  });

  const deleteBoardMutation = useMutation({
    mutationFn: async () => {
      return apiFetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Board deleted");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      onOpenChange(false);
      navigate({ to: "/workspace" });
    },
    onError: () => {
      toast.error("Failed to delete board");
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Board Settings</DialogTitle>
          <DialogDescription>
            Manage your board settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-4"
              placeholder="Board Name"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:justify-between sm:flex-row gap-2">
          <Button
            variant="destructive"
            onClick={() => deleteBoardMutation.mutate()}
            disabled={deleteBoardMutation.isPending}
          >
            {deleteBoardMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Board"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              onClick={() => updateBoardMutation.mutate(name)}
              disabled={updateBoardMutation.isPending || name === boardName}
            >
              {updateBoardMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
