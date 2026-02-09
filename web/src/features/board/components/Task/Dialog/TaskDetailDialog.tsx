import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useTaskDetail } from "../../../hooks/use-task-detail";
import { TaskDetailHeader } from "./TaskHeader";
import { TaskDetailDescription } from "./TaskDescription";
import { TaskDetailActivity } from "./TaskActivity";
import { TaskDetailSidebar } from "./TaskSidebar";
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
    boardName,
    listName,
    lists,
    title,
    setTitle,
    description,
    setDescription,
    candidates,
    session,
    deleteTaskMutation,
    updateTaskMutation,
    assignUserMutation,
    unassignUserMutation,
    isEditingTitle,
    handleStartEditingTitle,
    handleStopEditingTitle,
  } = useTaskDetail(taskId);

  if (!taskId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] min-h-[500px] h-[85vh] flex flex-col p-0 gap-0 bg-white border-none shadow-2xl rounded-[32px] overflow-hidden leading-relaxed animate-in zoom-in-95 duration-300">
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
              onDelete={() => {
                deleteTaskMutation.mutate(undefined, {
                  onSuccess: () => onOpenChange(false)
                });
              }}
              isEditingTitle={isEditingTitle}
              handleStartEditingTitle={handleStartEditingTitle}
              handleStopEditingTitle={handleStopEditingTitle}
            />

            <div className="flex-1 overflow-y-auto px-10 py-8 md:flex gap-16 bg-zinc-50/10">
              <div className="flex-1 space-y-16">
                <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                  <TaskDetailDescription
                    description={description}
                    setDescription={setDescription}
                    onUpdate={(data) => {
                      // Handle description update through the mutation in useTaskDetail
                    }}
                  />
                </section>

                <div className="h-px bg-zinc-100 w-full opacity-60" />

                <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                  <TaskDetailActivity
                    taskId={taskId}
                    userId={session?.user?.id}
                  />
                </section>
              </div>

              <div className="w-72 shrink-0 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
                <TaskDetailSidebar
                  assignees={task?.assignees || []}
                  candidates={candidates || []}
                  lists={lists}
                  currentListId={task?.listId}
                  currentUserId={session?.user?.id}
                  onAssign={(uid) => {
                    assignUserMutation.mutate(uid);
                  }}
                  onUnassign={(uid) => unassignUserMutation.mutate(uid)}
                  onChangeList={(listId) => {
                    updateTaskMutation.mutate({ listId });
                  }}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
