"use client";

import { Card } from "@/components/reusable/card";
import { MessageSquare, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface TaskCardProps {
  title: string;
  tags: string[];
  members: number;
  comments?: number;
  isDone?: boolean;
}

export function TaskCard({ title, tags, members, comments, isDone = false }: TaskCardProps) {
  return (
    <Card className="p-6 cursor-grab active:cursor-grabbing hover:translate-y-[-4px] transition-transform group">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className={cn(
              "px-2.5 py-1 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] text-[10px] font-extrabold uppercase tracking-tight",
              tag === "Bug" ? "bg-red-50 text-red-500" :
                tag === "AI" ? "bg-indigo-50 text-indigo-500" :
                  tag === "Design" ? "bg-accent/10 text-accent" :
                    "bg-zinc-100 text-zinc-600"
            )}>
              {tag}
            </span>
          ))}
        </div>
        <h4 className={cn("text-lg font-bold group-hover:text-primary transition-colors leading-snug", isDone && "line-through text-zinc-400")}>{title}</h4>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-50">
          <div className="flex -space-x-2">
            {[...Array(members)].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200 cursor-pointer hover:z-10 transition-all" />
            ))}
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            {comments !== undefined && (
              <div className="flex items-center gap-1.5 text-xs font-bold hover:text-primary transition-colors cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
                {comments}
              </div>
            )}
            <Paperclip className="w-3.5 h-3.5 hover:text-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </Card>
  );
}
