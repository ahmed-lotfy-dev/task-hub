import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Layout, ChevronRight, Edit3 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface TaskDetailHeaderProps {
  boardName?: string;
  listName?: string;
  title: string;
  setTitle: (title: string) => void;
  onDelete: () => void;
  isEditingTitle: boolean;
  handleStartEditingTitle: () => void;
  handleStopEditingTitle: () => void;
}

export function TaskDetailHeader({
  boardName = "Board",
  listName = "List",
  title,
  setTitle,
  onDelete,
  isEditingTitle,
  handleStartEditingTitle,
  handleStopEditingTitle,
}: TaskDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white border-b border-zinc-100 shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Layout className="w-3.5 h-3.5" />
        <span>Workspaces</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-500">{boardName}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 border-b border-zinc-900 pb-0.5">{listName}</span>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <Input
            className={cn(
              "p-0 h-auto text-2xl font-black tracking-tight border-none shadow-none focus-visible:ring-0 bg-transparent text-zinc-900 placeholder:text-zinc-200",
              isEditingTitle ? "" : "cursor-text"
            )}
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleStopEditingTitle}
            readOnly={!isEditingTitle}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 pr-8">
          {!isEditingTitle ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all rounded-xl"
              onClick={handleStartEditingTitle}
            >
              <Edit3 className="w-5 h-5" />
            </Button>
          ) : null}

          <ConfirmDialog
            title="Delete Task"
            description="This action is permanent and cannot be undone."
            variant="destructive"
            confirmLabel="Delete Task"
            onConfirm={onDelete}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </div>
  );
}
