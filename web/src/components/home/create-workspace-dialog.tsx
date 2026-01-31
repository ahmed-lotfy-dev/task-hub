import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { workspaceSchema, type WorkspaceFormValues } from "@taskflow/shared";
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
import { useCreateWorkspace } from "@/hooks/use-workspaces";
import { toast } from "sonner";

interface CreateWorkspaceDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ children, open, onOpenChange }: CreateWorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const show = isControlled ? open : internalOpen;
  const setShow = isControlled ? onOpenChange : setInternalOpen;

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
      setShow(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create workspace");
      console.error(error);
    }
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your boards and tasks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Main workspace for engineering tasks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
