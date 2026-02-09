"use client";

import { MessageSquare, AlignLeft, CheckSquare, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  id: string;
  title: string;
  labels?: { id: string; name: string; color: string }[];
  members: number;
  comments: number;
  hasDescription?: boolean;
  checklistItems?: number;
  checklistCompleted?: number;
  assignees?: { id: string; name: string; image: string | null }[];
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  onClick?: () => void;
  isDone?: boolean;
}

export function TaskCard({
  title,
  labels = [],
  comments,
  hasDescription,
  checklistItems,
  checklistCompleted,
  assignees = [],
  priority,
  dueDate,
  onClick,
  isDone = false
}: TaskCardProps) {

  // Helper to determine label color class
  const getLabelColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20';
      case 'yellow': return 'bg-amber-400/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20';
      case 'orange': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20';
      case 'red': return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20';
      case 'purple': return 'bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/20';
      case 'blue': return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/20';
      default: return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-zinc-800 rounded-xl",
        "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]",
        "border border-transparent hover:border-cyan-500/20",
        "transition-all duration-300 ease-out cursor-pointer group relative select-none",
        "p-4 flex flex-col gap-3",
        "transform hover:-translate-y-0.5", // Micro-lift
        isDone && "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Priority Indicator - Subtle corner accent */}
      {priority && (
        <div
          className={cn(
            "absolute top-0 right-0 w-8 h-8 rounded-bl-xl rounded-tr-xl flex items-center justify-center backdrop-blur-sm",
            priority === "high" ? "bg-rose-500/10 text-rose-600" :
              priority === "medium" ? "bg-amber-400/10 text-amber-600" :
                "bg-emerald-400/10 text-emerald-600"
          )}
          title={`Priority: ${priority}`}
        >
          <div className={cn("w-1.5 h-1.5 rounded-full",
            priority === "high" ? "bg-rose-500" :
              priority === "medium" ? "bg-amber-500" :
                "bg-emerald-500"
          )} />
        </div>
      )}

      {/* Labels - Modern Pill Style */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labels.map(label => (
            <div
              key={label.id}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all",
                getLabelColor(label.color).split(' ')[0] // Just take the bg color for the minimal bar
              )}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className={cn(
        "text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-snug wrap-break-word pr-6 font-sans tracking-tight",
        isDone && "line-through text-slate-400"
      )}>
        {title}
      </h4>

      {/* Badges / Metrics Row */}
      <div className="flex items-center flex-wrap gap-3 text-slate-400 dark:text-slate-500 text-xs font-medium">

        {/* Due Date */}
        {dueDate && (
          <div className={cn(
            "flex items-center gap-1.5 p-1 px-2 rounded-md",
            "bg-slate-50 hover:bg-slate-100 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 transition-colors",
            "text-slate-500 dark:text-slate-400 group-hover:text-cyan-600"
          )}>
            <Clock className="w-3.5 h-3.5" />
            <span>{format(new Date(dueDate), "MMM d")}</span>
          </div>
        )}

        {/* Description Badge */}
        {hasDescription && (
          <div className="flex items-center hover:text-cyan-600 transition-colors" title="This card has a description">
            <AlignLeft className="w-4 h-4" />
          </div>
        )}

        {/* Comments Badge */}
        {comments > 0 && (
          <div className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{comments}</span>
          </div>
        )}

        {/* Checklists Badge */}
        {checklistItems && checklistItems > 0 ? (
          <div className={cn(
            "flex items-center gap-1 transition-colors",
            (checklistCompleted || 0) === checklistItems
              ? "text-emerald-500"
              : "hover:text-cyan-600"
          )}>
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{checklistCompleted}/{checklistItems}</span>
          </div>
        ) : null}

        {/* Assignees (Right Aligned) */}
        {assignees.length > 0 && (
          <div className="flex -space-x-2 ml-auto">
            {assignees.map((assignee) => (
              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white dark:border-zinc-800 ring-2 ring-transparent transition-transform hover:scale-110 hover:z-10 hover:ring-cyan-100">
                <AvatarImage src={assignee.image || ""} />
                <AvatarFallback className="text-[9px] bg-cyan-50 text-cyan-700 font-bold uppercase">
                  {assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
