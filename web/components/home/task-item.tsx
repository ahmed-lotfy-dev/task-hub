"use client";

import { Card } from "@/components/reusable/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

interface TaskItemProps {
  title: string;
  project: string;
  status: string;
}

export function TaskItem({ title, project, status }: TaskItemProps) {
  return (
    <Card className="p-5 flex items-center justify-between hover:translate-x-2 transition-transform cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className="w-6 h-6 rounded-full border-2 border-primary/30 group-hover:border-primary group-hover:bg-primary/5 transition-all" />
        <div className="flex flex-col">
          <span className="font-bold text-lg group-hover:text-primary transition-colors">{title}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">{project}</span>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <span className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
          status === "Urgent" ? "bg-red-50 text-red-500" :
            status === "High" ? "bg-orange-50 text-orange-500" : "bg-zinc-100 text-zinc-500"
        )}>
          {status}
        </span>
        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );
}
