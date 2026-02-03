"use client";

import { Paperclip, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  id: string;
  title: string;
  tags: string[];
  members: number;
  comments: number;
  assignees?: { id: string; name: string; image: string | null }[];
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  onClick?: () => void;
  isDone?: boolean;
}

export function TaskCard({ title, tags, comments, assignees = [], priority, onClick, isDone = false }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white p-4 rounded-2xl shadow-sm border border-zinc-100/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-200 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-2xl before:transition-colors",
        priority === "high" && "before:bg-rose-500 bg-rose-50/5 border-rose-100",
        priority === "medium" && "before:bg-amber-400 bg-amber-50/5 border-amber-100",
        priority === "low" && "before:bg-emerald-400 bg-emerald-50/5 border-emerald-100",
        !priority && "before:bg-zinc-200"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className={cn(
              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight",
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

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-100">
          <div className="flex items-center gap-4 text-gray-400">
            {/* Assignees */}
            {assignees.length > 0 && (
              <div className="flex -space-x-2 overflow-hidden">
                {assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white">
                    <AvatarImage src={assignee.image || ""} />
                    <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600 font-bold">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {assignees.length > 3 && (
                  <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 text-[10px] font-medium text-gray-600">
                    +{assignees.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Comments Count */}
            {comments > 0 && (
              <div className="flex items-center gap-1.5 text-xs hover:text-indigo-500 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-medium">{comments}</span>
              </div>
            )}
          </div>
          <Paperclip className="w-3.5 h-3.5 hover:text-primary transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
