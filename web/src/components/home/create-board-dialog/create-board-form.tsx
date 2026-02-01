import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { boardSchema, type BoardFormValues } from "@taskflow/shared";
import { useCreateBoard } from "@/hooks/use-boards";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { Form } from "@/components/ui/form";
import { BoardFormFields } from "./board-form-fields";

interface CreateBoardFormProps {
  defaultWorkspaceId?: string;
  onSuccess: () => void;
}

export function CreateBoardForm({ defaultWorkspaceId, onSuccess }: CreateBoardFormProps) {
  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { mutateAsync: createBoard, isPending } = useCreateBoard();

  const form = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      workspaceId: defaultWorkspaceId || "",
      visibility: "private",
      template: "blank",
    } as BoardFormValues,
  });

  const selectedWorkspaceId = form.watch("workspaceId");

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (!selectedWorkspaceId && workspaces && workspaces.length > 0) {
      form.setValue("workspaceId", workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId, form]);

  async function onSubmit(data: BoardFormValues) {
    try {
      await createBoard(data);
      toast.success("Board created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Failed to create board");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <BoardFormFields
        form={form}
        workspaces={workspaces}
        isLoadingWorkspaces={isLoadingWorkspaces}
        defaultWorkspaceId={defaultWorkspaceId}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Form>
  );
}
