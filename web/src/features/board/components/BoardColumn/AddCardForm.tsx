"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useCreateTask } from "@/hooks/use-tasks";
import { toast } from "sonner";

interface AddCardFormProps {
  listId: string;
  boardId: string;
  onCancel: () => void;
}

export function AddCardForm({ listId, boardId, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const mutation = useCreateTask();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;

    mutation.mutate(
      {
        boardId,
        listId,
        title: title.trim(),
        position: 65535, // Append to end
        priority: "medium", // Default
      },
      {
        onSuccess: () => {
          setTitle("");
          toast.success("Task added");
          // Keep form open for rapid entry like Trello
        },
        onError: (error) => {
          toast.error(`Failed to add task: ${error.message}`);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="px-2 pb-2">
      <div className="mb-2">
        <Textarea
          autoFocus
          placeholder="Enter a title for this card..."
          className="min-h-[60px] resize-none py-2 px-3 text-sm shadow-sm bg-white ring-1 ring-black/5 border-none focus-visible:ring-2 focus-visible:ring-blue-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add card"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-accent/50"
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
