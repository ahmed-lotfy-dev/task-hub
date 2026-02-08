"use client";

import { Plus, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AddCardForm } from "./AddCardForm";
import { useParams } from "react-router";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BoardColumnProps {
  id: string;
  title: string;
  count: number;
  variant?: "default" | "blue" | "orange" | "green";
  children: React.ReactNode;
}

export function BoardColumn({ id, title, count, children }: BoardColumnProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { boardId } = useParams();
  const { setNodeRef } = useDroppable({
    id: id,
    disabled: !id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col shrink-0 w-[280px] h-full max-h-full rounded-2xl",
        "bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-md",
        "border border-white/20 dark:border-white/5 shadow-sm",
        "transition-colors duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 pb-2 group drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate leading-5">
            {title}
          </h3>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-slate-500 bg-slate-200/50 dark:text-slate-400 dark:bg-zinc-800 rounded-full">
            {count}
          </span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-slate-700"
            aria-label="Quick add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-200/50 dark:hover:bg-zinc-800 text-slate-500"
            aria-label="List actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tasks Scrollable Area */}
      <div className="flex-1 flex flex-col gap-2.5 p-2 overflow-y-auto custom-scrollbar min-h-0">
        {children}
      </div>

      {/* Footer / Add Task */}
      {!isCreateOpen ? (
        <div className="p-3 pt-0 mt-auto">
          <button
            onClick={() => setIsCreateOpen(true)}
            className={cn(
              "flex items-center gap-2 w-full p-2.5 rounded-xl",
              "text-slate-500 hover:text-slate-800 hover:bg-white/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5",
              "transition-all duration-200 group text-[14px] font-medium"
            )}
          >
            <div className="p-0.5 rounded-md bg-transparent group-hover:bg-slate-200/50 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add a card</span>
          </button>
        </div>
      ) : (
        <AddCardForm
          listId={id}
          boardId={boardId || ""}
          onCancel={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
