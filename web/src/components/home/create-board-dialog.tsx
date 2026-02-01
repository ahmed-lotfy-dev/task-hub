import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBoardForm } from "./create-board-dialog/create-board-form";

interface CreateBoardDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultWorkspaceId?: string;
}

export function CreateBoardDialog({
  children,
  open,
  onOpenChange,
  defaultWorkspaceId,
}: CreateBoardDialogProps) {
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
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Add a new board to track your projects.
          </DialogDescription>
        </DialogHeader>
        <CreateBoardForm defaultWorkspaceId={defaultWorkspaceId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
