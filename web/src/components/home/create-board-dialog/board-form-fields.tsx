import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { BoardFormValues, Workspace } from "@taskflow/shared";
import {
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
import { DialogFooter } from "@/components/ui/dialog";

interface BoardFormFieldsProps {
  form: UseFormReturn<BoardFormValues>;
  workspaces: Workspace[] | undefined;
  isLoadingWorkspaces: boolean;
  defaultWorkspaceId?: string;
  isPending: boolean;
  onSubmit: (data: BoardFormValues) => void;
}

export function BoardFormFields({
  form,
  workspaces,
  isLoadingWorkspaces,
  defaultWorkspaceId,
  isPending,
  onSubmit,
}: BoardFormFieldsProps) {
  return (
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
                  <SelectValue
                    placeholder={
                      isLoadingWorkspaces ? "Loading workspaces..." : "Select workspace"
                    }
                  />
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
        <Button
          type="submit"
          disabled={isPending || !form.watch("workspaceId")}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Board
        </Button>
      </DialogFooter>
    </form>
  );
}
