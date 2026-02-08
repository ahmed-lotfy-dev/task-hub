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
      case 'green': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20';
      case 'yellow': return 'bg-amber-400/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20';
      case 'orange': return 'bg-orange-500/15 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20';
      case 'red': return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20';
      case 'purple': return 'bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/20';
      case 'blue': return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20';
      default: return 'bg-slate-200 text-slate-700 ring-1 ring-slate-500/10';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-zinc-800 rounded-xl",
        "shadow-sm hover:shadow-md border border-slate-200/60 dark:border-zinc-700",
        "transition-all duration-200 ease-out cursor-pointer group relative select-none",
        "p-3.5 flex flex-col gap-2.5",
        isDone && "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Priority Stripe (if exists) */}
      {priority && (
        <div
          className={cn(
            "absolute top-3.5 right-3.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-zinc-800",
            priority === "high" ? "bg-rose-500" :
              priority === "medium" ? "bg-amber-400" :
                "bg-emerald-400"
          )}
          title={`Priority: ${priority}`}
          aria-label={`Priority: ${priority}`}
        />
      )}

      {/* Labels - Modern Pill Style */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-0.5">
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
        "text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-snug wrap-break-word pr-4",
        isDone && "line-through text-slate-400"
      )}>
        {title}
      </h4>

      {/* Badges / Metrics Row */}
      <div className="flex items-center flex-wrap gap-3 mt-1 text-slate-500 dark:text-slate-400 text-xs font-medium">

        {/* Due Date */}
        {dueDate && (
          <div className={cn(
            "flex items-center gap-1 p-1 px-1.5 rounded-md",
            "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors",
            "text-slate-600 dark:text-slate-300"
          )}>
            <Clock className="w-3 h-3" />
            <span>{format(new Date(dueDate), "MMM d")}</span>
          </div>
        )}

        {/* Description Badge */}
        {hasDescription && (
          <div className="flex items-center text-slate-400" title="This card has a description">
            <AlignLeft className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Comments Badge */}
        {comments > 0 && (
          <div className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{comments}</span>
          </div>
        )}

        {/* Checklists Badge */}
        {checklistItems && checklistItems > 0 ? (
          <div className={cn(
            "flex items-center gap-1",
            (checklistCompleted || 0) === checklistItems
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500"
          )}>
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{checklistCompleted}/{checklistItems}</span>
          </div>
        ) : null}

        {/* Assignees (Right Aligned) */}
        {assignees.length > 0 && (
          <div className="flex -space-x-2 ml-auto">
            {assignees.map((assignee) => (
              <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white dark:border-zinc-800 ring-1 ring-slate-200 dark:ring-zinc-700">
                <AvatarImage src={assignee.image || ""} />
                <AvatarFallback className="text-[9px] bg-slate-100 text-slate-700 font-bold uppercase">
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
