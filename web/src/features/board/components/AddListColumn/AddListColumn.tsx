import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface AddListColumnProps {
  boardId: string;
}

export function AddListColumn({ boardId }: AddListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState("");
  const queryClient = useQueryClient();

  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      const position = Math.floor(Date.now() / 1000);
      console.log('Creating list with position:', position, 'Date.now():', Date.now());
      return apiFetch(`/api/lists`, {
        method: "POST",
        body: JSON.stringify({
          boardId,
          name,
          position,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      toast.success("Column added successfully");
      setListName("");
      setIsAdding(false);
    },
    onError: (error: any) => {
      console.error("Failed to create list:", error);
      toast.error(error?.message || "Failed to add column");
    },
  });

  const handleSubmit = () => {
    if (listName.trim()) {
      createListMutation.mutate(listName.trim());
    }
  };

  const handleCancel = () => {
    setListName("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="shrink-0 w-[272px] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-100 p-3">
        <Input
          placeholder="Enter column name..."
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") handleCancel();
          }}
          className="mb-2 bg-zinc-50 border-zinc-200 focus:border-primary"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!listName.trim() || createListMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            Add Column
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="shrink-0 w-[272px] h-12 flex items-center justify-center gap-2 bg-slate-100/80 hover:bg-slate-200/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:text-slate-800 transition-all duration-200 group"
    >
      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium">Add a column</span>
    </button>
  );
}
