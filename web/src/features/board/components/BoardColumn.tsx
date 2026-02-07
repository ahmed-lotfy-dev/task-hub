"use client";

import { Plus, MoreVertical } from "lucide-react";
import { useState } from "react";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { useParams } from "react-router";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  id: string; // List ID needed for creation
  title: string;
  count: number;
  variant?: "default" | "blue" | "orange" | "green";
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-zinc-50/50 border-zinc-100",
  blue: "bg-indigo-50/50 border-indigo-100",
  orange: "bg-orange-50/50 border-orange-100",
  green: "bg-emerald-50/50 border-emerald-100",
};

const headerStyles = {
  default: "text-zinc-700",
  blue: "text-indigo-700",
  orange: "text-orange-700",
  green: "text-emerald-700",
};

const badgeStyles = {
  default: "bg-white text-zinc-500",
  blue: "bg-indigo-100 text-indigo-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-emerald-100 text-emerald-600",
};

export function BoardColumn({ id, title, count, variant = "default", children }: BoardColumnProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { boardId } = useParams({ strict: false });
  const { setNodeRef } = useDroppable({
    id: id,
    disabled: !id,
  });

  return (
    <div ref={setNodeRef} className={`flex flex-col gap-5 h-full min-h-[500px] rounded-3xl p-4 border transition-colors ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className={`font-extrabold text-lg tracking-tight ${headerStyles[variant]}`}>{title}</span>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black shadow-sm ${badgeStyles[variant]}`}>{count}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/60 hover:shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-400 hover:text-primary transition-colors" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/60 hover:shadow-sm transition-all cursor-pointer">
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {children}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 p-3 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 hover:text-primary hover:border-primary/20 hover:bg-white/50 transition-all text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {boardId && (
        <CreateTaskDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          boardId={boardId}
          listId={id}
        />
      )}
    </div>
  );
}
