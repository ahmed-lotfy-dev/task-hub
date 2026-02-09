"use client";

import { TaskItem } from "../TaskItem/TaskItem";

interface PriorityTasksProps {
  tasks: any[] | undefined;
}

export function PriorityTasks({ tasks }: PriorityTasksProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Priority tasks</h2>
          <p className="text-sm text-muted-foreground">Important items that need attention.</p>
        </div>
        <button className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
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
          <div className="py-10 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">All caught up. No priority tasks right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}
