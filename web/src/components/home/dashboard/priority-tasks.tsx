import { Card as Task } from "@taskflow/shared";
import { TaskItem } from "@/components/home/task-item";

interface PriorityTasksProps {
  tasks: Task[] | undefined;
}

export function PriorityTasks({ tasks }: PriorityTasksProps) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Priority Focus</h2>
      <div className="flex flex-col gap-4">
        {tasks?.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            project="Direct Task"
            status={(task.priority as any) || "Medium"}
          />
        ))}
        {tasks?.length === 0 && (
          <p className="text-sm text-muted-foreground font-medium italic">
            No high priority tasks assigned to you.
          </p>
        )}
      </div>
    </section>
  );
}
