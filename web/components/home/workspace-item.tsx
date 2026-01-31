"use client";

import { Users, ChevronRight } from "lucide-react";
import React from "react";

interface WorkspaceItemProps {
  name: string;
  members: number;
  icon: string;
}

export function WorkspaceItem({ name, members, icon }: WorkspaceItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group border border-transparent hover:border-zinc-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 group-hover:bg-primary group-hover:text-white transition-all">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight">{name}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Users className="w-3 h-3" /> {members} members
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}
