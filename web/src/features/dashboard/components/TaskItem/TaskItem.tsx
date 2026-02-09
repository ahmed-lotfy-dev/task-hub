"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TaskItemProps {
  title: string;
  project: string;
  status: string;
}

export function TaskItem({ title, project, status }: TaskItemProps) {
  return (
    <Card className="p-5 flex items-center justify-between hover:-translate-y-0.5 transition-transform cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
        <div className="flex flex-col">
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mt-1">
            {project}
          </span>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
            status === "Urgent"
              ? "bg-destructive/10 text-destructive"
              : status === "High"
              ? "bg-amber-500/10 text-amber-600"
              : "bg-muted text-muted-foreground"
          )}
        >
          {status}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Card>
  );
}
