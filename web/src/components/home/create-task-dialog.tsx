import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { taskSchema, type TaskFormValues } from "@taskflow/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/use-tasks";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { toast } from "sonner";
import { useEffect } from "react";

interface CreateTaskDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultBoardId?: string;
}

export function CreateTaskDialog({ children, open, onOpenChange, defaultBoardId }: CreateTaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const show = isControlled ? open : internalOpen;
  const setShow = isControlled ? onOpenChange : setInternalOpen;

  const { data: boards } = useBoards();
  const { mutateAsync: createTask, isPending } = useCreateTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      boardId: defaultBoardId || "",
      listId: "",
      priority: "medium",
      position: 0,
      labelIds: [],
      assigneeIds: [],
    } as TaskFormValues,
  });

  const selectedBoardId = form.watch("boardId");
  const { data: lists, isLoading: isLoadingLists } = useLists(selectedBoardId);

  // Auto-select first board if none selected
  useEffect(() => {
    if (!selectedBoardId && boards && boards.length > 0) {
      form.setValue("boardId", boards[0].id);
    }
  }, [boards, selectedBoardId, form]);

  // Auto-select first list when board changes
  useEffect(() => {
    if (lists && lists.length > 0) {
      form.setValue("listId", lists[0].id);
    } else {
      form.setValue("listId", "");
    }
  }, [lists, form]);

  async function onSubmit(data: TaskFormValues) {
    try {
      // In a real app, lists would be fetched from the board. For now, using a placeholder list ID or default.
      // This is a simplification since the backend requires listId.
      // We might need to fetch lists for the selected board first.
      // For this step, I'll pass a dummy 'default-list' or we need to update the backend/hook to handle it.
      // Assuming backend might create a default list or we need to pick one.

      await createTask(data);
      toast.success("Task created successfully");
      setShow(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Quickly add a task to your board.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!defaultBoardId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {boards?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Fix login bug..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingLists || !lists?.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLists ? "Loading lists..." : "Select list"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lists?.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
