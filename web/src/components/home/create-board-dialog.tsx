import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { boardSchema, type BoardFormValues } from "@taskflow/shared";
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
import { useCreateBoard } from "@/hooks/use-boards";
import { toast } from "sonner";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useEffect } from "react";

interface CreateBoardDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultWorkspaceId?: string;
}

export function CreateBoardDialog({ children, open, onOpenChange, defaultWorkspaceId }: CreateBoardDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const show = isControlled ? open : internalOpen;
  const setShow = isControlled ? onOpenChange : setInternalOpen;

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
      setShow(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create board");
      console.error(error);
    }
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Add a new board to track your projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!!defaultWorkspaceId || isLoadingWorkspaces}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingWorkspaces ? "Loading workspaces..." : "Select workspace"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaces?.length ? (
                        workspaces.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center italic">
                          No workspaces found.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Alpha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blank">Blank Board</SelectItem>
                      <SelectItem value="kanban">Kanban</SelectItem>
                      <SelectItem value="scrum">Scrum</SelectItem>
                      <SelectItem value="bug_tracker">Bug Tracker</SelectItem>
                      <SelectItem value="simple">Simple List</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending || !selectedWorkspaceId}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Board
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
