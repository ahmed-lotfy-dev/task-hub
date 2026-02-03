import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Layout, ChevronRight } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface TaskDetailHeaderProps {
  boardName?: string;
  listName?: string;
  title: string;
  setTitle: (title: string) => void;
  listId?: string;
  lists?: any[];
  priority: string;
  setPriority: (priority: string) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

export function TaskDetailHeader({
  boardName = "Board",
  listName = "List",
  title,
  setTitle,
  listId,
  lists,
  priority,
  setPriority,
  onUpdate,
  onDelete,
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
            className="p-0 h-auto text-2xl font-black tracking-tight border-none shadow-none focus-visible:ring-0 bg-transparent text-zinc-900 placeholder:text-zinc-200"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title) onUpdate({ title });
            }}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 pr-8">
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

      <div className="flex items-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">List</span>
          <Select
            disabled={!listId}
            value={listId}
            onValueChange={(val) => onUpdate({ listId: val })}
          >
            <SelectTrigger className="h-8 px-3 text-xs font-bold border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors rounded-lg border-none shadow-none ring-1 ring-zinc-200/50">
              <SelectValue placeholder="In List..." />
            </SelectTrigger>
            <SelectContent>
              {lists?.map((list) => (
                <SelectItem key={list.id} value={list.id} className="text-xs font-medium">
                  {list.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Priority</span>
          <Select
            value={priority}
            onValueChange={(val) => {
              setPriority(val);
              onUpdate({ priority: val });
            }}
          >
            <SelectTrigger className={cn(
              "h-8 px-3 text-xs font-bold transition-all rounded-lg border-none shadow-none ring-1",
              priority === 'high' ? "ring-red-100 bg-red-50 text-red-600" :
                priority === 'medium' ? "ring-amber-100 bg-amber-50 text-amber-600" :
                  "ring-emerald-100 bg-emerald-50 text-emerald-600"
            )}>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low" className="text-emerald-600 font-bold italic">Low</SelectItem>
              <SelectItem value="medium" className="text-amber-600 font-bold italic">Medium</SelectItem>
              <SelectItem value="high" className="text-red-600 font-bold italic">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
