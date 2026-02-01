import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { workspaceSchema, type WorkspaceFormValues } from "@taskflow/shared";
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import { Form } from "@/components/ui/form";
import { WorkspaceFormFields } from "./workspace-form-fields";

interface CreateWorkspaceFormProps {
  onSuccess: () => void;
}

export function CreateWorkspaceForm({ onSuccess }: CreateWorkspaceFormProps) {
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace();

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      visibility: "private",
    } as WorkspaceFormValues,
  });

  async function onSubmit(data: WorkspaceFormValues) {
    try {
      await createWorkspace(data);
      toast.success("Workspace created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Failed to create workspace");
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <WorkspaceFormFields
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Form>
  );
}
