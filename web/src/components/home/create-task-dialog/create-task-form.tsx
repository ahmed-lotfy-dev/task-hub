import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { taskSchema, type TaskFormValues } from "@taskflow/shared";
import { useCreateTask } from "@/hooks/use-tasks";
import { useBoards } from "@/hooks/use-boards";
import { useLists } from "@/hooks/use-lists";
import { Form } from "@/components/ui/form";
import { TaskFormFields } from "./task-form-fields";

interface CreateTaskFormProps {
  defaultBoardId?: string;
  onSuccess: () => void;
}

export function CreateTaskForm({ defaultBoardId, onSuccess }: CreateTaskFormProps) {
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
      await createTask(data);
      toast.success("Task created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <TaskFormFields
        form={form}
        boards={boards}
        lists={lists}
        isLoadingLists={isLoadingLists}
        defaultBoardId={defaultBoardId}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Form>
  );
}
