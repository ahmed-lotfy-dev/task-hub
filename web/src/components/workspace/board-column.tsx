"use client";

import { Plus, MoreVertical } from "lucide-react";

interface BoardColumnProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

export function BoardColumn({ title, count, children }: BoardColumnProps) {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-[#2D3748]">{title}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-zinc-100 text-xs font-extrabold text-zinc-500">{count}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
            <Plus className="w-4 h-4 text-zinc-400 hover:text-primary transition-colors" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
            <MoreVertical className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
