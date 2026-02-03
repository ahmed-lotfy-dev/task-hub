import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useTaskDetail } from "../../hooks/use-task-detail";
import { TaskDetailHeader } from "./Header";
import { TaskDetailDescription } from "./Description";
import { TaskDetailActivity } from "./Activity";
import { TaskDetailSidebar } from "./Sidebar";
import { Loader2 } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TaskDetailDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
  const {
    task,
    isLoadingTask,
    lists,
    boardName,
    listName,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    candidates,
    session,
    updateTaskMutation,
    deleteTaskMutation,
    assignUserMutation,
    unassignUserMutation,
  } = useTaskDetail(taskId);

  if (!taskId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] min-h-[500px] h-[85vh] flex flex-col p-0 gap-0 bg-white border-none shadow-2xl rounded-3xl overflow-hidden leading-relaxed">
        <div className="sr-only">
          <DialogTitle>{title || "Task Detail"}</DialogTitle>
          <DialogDescription>
            {description ? `Detailed view for task: ${title}` : "Manage and view task details, assignees, and activity."}
          </DialogDescription>
        </div>
        {isLoadingTask ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
          </div>
        ) : (
          <>
            <TaskDetailHeader
              boardName={boardName}
              listName={listName}
              title={title}
              setTitle={setTitle}
              listId={task?.listId}
              lists={lists}
              priority={priority}
              setPriority={setPriority}
              onUpdate={(data) => updateTaskMutation.mutate(data)}
              onDelete={() => {
                deleteTaskMutation.mutate(undefined, {
                  onSuccess: () => onOpenChange(false)
                });
              }}
            />

            <div className="flex-1 overflow-y-auto px-8 py-6 md:flex gap-12 bg-zinc-50/10">
              <div className="flex-1 space-y-12">
                <section>
                  <TaskDetailDescription
                    description={description}
                    setDescription={setDescription}
                    onUpdate={(data) => updateTaskMutation.mutate(data)}
                  />
                </section>

                <div className="h-px bg-zinc-100 w-full" />

                <section>
                  <TaskDetailActivity
                    taskId={taskId}
                    userId={session?.user?.id}
                  />
                </section>
              </div>

              <div className="w-64 shrink-0 space-y-10">
                <TaskDetailSidebar
                  assignees={task?.assignees || []}
                  candidates={candidates || []}
                  currentUserId={session?.user?.id}
                  onAssign={(uid) => {
                    assignUserMutation.mutate(uid);
                  }}
                  onUnassign={(uid) => unassignUserMutation.mutate(uid)}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
