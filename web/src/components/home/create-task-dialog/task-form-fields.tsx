import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { TaskFormValues } from "@taskflow/shared";
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

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  boards: { id: string; name: string }[] | undefined;
  lists: { id: string; name: string }[] | undefined;
  isLoadingLists: boolean;
  defaultBoardId?: string;
  isPending: boolean;
  onSubmit: (data: TaskFormValues) => void;
}

export function TaskFormFields({
  form,
  boards,
  lists,
  isLoadingLists,
  defaultBoardId,
  isPending,
  onSubmit,
}: TaskFormFieldsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="boardId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!!defaultBoardId}
            >
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
                  <SelectValue
                    placeholder={isLoadingLists ? "Loading lists..." : "Select list"}
                  />
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
  );
}
