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
import { Loader2, UserPlus, Globe, LayoutGrid } from "lucide-react";

interface InviteDialogProps {
  workspaceId?: string;
  boardId?: string;
  trigger?: React.ReactNode;
}

export function InviteDialog({ workspaceId, boardId, trigger }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const isWorkspaceInvite = !!workspaceId && !boardId;

  const inviteMutation = useMutation({
    mutationFn: async (json: any) => {
      const response: any = await apiFetch("/api/invitations", {
        method: "POST",
        body: JSON.stringify(json),
      });
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isWorkspaceInvite ? (
              <>
                <Globe className="w-5 h-5" />
                Invite to Workspace
              </>
            ) : (
              <>
                <LayoutGrid className="w-5 h-5" />
                Invite to Board
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isWorkspaceInvite ? (
              <>
                This will give the user access to <span className="font-medium">all boards</span> in this workspace.
                They'll be able to view and edit tasks across the entire workspace.
              </>
            ) : (
              <>
                This will give the user access to <span className="font-medium">only this board</span>.
                They'll not have access to other boards in this workspace.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">
                  <div className="flex items-center gap-2">
                    <span>Member</span>
                    <span className="text-muted-foreground text-xs">Can edit</span>
                  </div>
                </SelectItem>
                <SelectItem value="observer">
                  <div className="flex items-center gap-2">
                    <span>Observer</span>
                    <span className="text-muted-foreground text-xs">View only</span>
                  </div>
                </SelectItem>
                {isWorkspaceInvite && (
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <span>Admin</span>
                      <span className="text-muted-foreground text-xs">Full access</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
            {isWorkspaceInvite ? (
              <p>
                <strong>Workspace invite:</strong> User gets access to all boards and can be invited to specific boards.
              </p>
            ) : (
              <p>
                <strong>Board-only invite:</strong> User only sees this board. For full workspace access, invite at workspace level.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
