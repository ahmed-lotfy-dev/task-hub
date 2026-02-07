import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

interface InviteDialogProps {
  workspaceId?: string;
  boardId?: string;
  trigger?: React.ReactNode;
}

export function InviteDialog({ workspaceId, boardId, trigger }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const inviteMutation = useMutation({
    mutationFn: async (json: any) => {
      const response: any = await apiFetch("/api/invitations", {
        method: "POST",
        body: JSON.stringify(json),
      });
      // Check if response contains an error
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return response;
    },
    onSuccess: (data: any) => {
      if (data.method === "direct_add") {
        toast.success(data.message, {
          duration: 5000,
        });
      } else {
        toast.success(data.message || "Invitation sent successfully!");
      }
      setOpen(false);
      setEmail("");
    },
    onError: (error: Error) => {
      // Check if this is a duplicate invitation error
      if (error.message.includes("Invitation already sent")) {
        toast.warning(error.message, {
          duration: 6000,
        });
      } else {
        toast.error(`Failed to send invitation: ${error.message}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    inviteMutation.mutate({
      email,
      workspaceId,
      boardId,
      role,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite to {workspaceId ? "Workspace" : "Board"}</DialogTitle>
          <DialogDescription>
            Users with existing accounts will be added directly. New users will receive an email invitation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="observer">Observer (Read-only)</SelectItem>
                {workspaceId && <SelectItem value="admin">Admin</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="col-span-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
