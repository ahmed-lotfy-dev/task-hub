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
      <Card className="p-6 hover:-translate-y-1 transition-transform cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", color)} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {workspace}
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {activeTasks} active
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-foreground">{name}</h3>
        <div className="mt-4 flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted" />
          ))}
        </div>
      </Card>
    </Link>
  );
}
