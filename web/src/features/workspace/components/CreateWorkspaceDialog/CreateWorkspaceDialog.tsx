import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "../CreateWorkspaceForm/CreateWorkspaceForm";

interface CreateWorkspaceDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
  children,
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const show = isControlled ? open : internalOpen;
  const setShow = isControlled ? onOpenChange : setInternalOpen;

  const handleSuccess = () => {
    setShow(false);
  };

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
        <CreateWorkspaceForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
