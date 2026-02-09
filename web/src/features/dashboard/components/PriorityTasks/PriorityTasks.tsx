"use client";

import { TaskItem } from "../TaskItem/TaskItem";

interface PriorityTasksProps {
  tasks: any[] | undefined;
}

export function PriorityTasks({ tasks }: PriorityTasksProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#2D3748] tracking-tight">Priority Tasks</h2>
        <button className="text-sm font-bold text-primary hover:underline">View All</button>
      </div>
      <div className="flex flex-col gap-4">
        {tasks?.slice(0, 5).map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            project={task.boardName || "Board"}
            status={task.priority === "high" ? "Urgent" : task.priority === "medium" ? "High" : "Low"}
          />
        ))}
        {(!tasks || tasks.length === 0) && (
          <div className="py-12 flex flex-col items-center justify-center bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl">
            <p className="text-muted-foreground font-medium italic">All caught up! No priority tasks at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
