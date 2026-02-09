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
        "bg-white/40 dark:bg-black/40 backdrop-blur-xl", // Enhanced Glass
        "border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]", // Neo-Glass Shadow
        "transition-colors duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3 group drag-handle cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-3 overflow-hidden">
          <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate leading-5 tracking-tight font-sans">
            {title}
          </h3>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-2 text-[11px] font-bold text-cyan-700 bg-cyan-100/80 dark:text-cyan-300 dark:bg-cyan-900/50 rounded-full shadow-sm ring-1 ring-cyan-500/10">
            {count}
          </span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-cyan-600 active:scale-95"
            aria-label="Quick add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/50 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 transition-all"
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
