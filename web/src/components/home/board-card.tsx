"use client";

import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BoardCardProps {
  id: string;
  name: string;
  workspace: string;
  color: string;
  activeTasks: number;
}

export function BoardCard({ id, name, workspace, color, activeTasks }: BoardCardProps) {
  return (
    <Link to={`/board/${id}`} className="block">
      <Card className="p-6 hover:translate-y-[-8px] transition-all cursor-pointer group relative overflow-hidden">
        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-10 -mt-10", color)} />
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className={cn("w-10 h-10 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg", color)}>
              {name[0]}
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200" />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D3748] group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{workspace}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase">{activeTasks} Active Tasks</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
