import { useState } from "react";
import { Users, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWorkspaceMembers, useRemoveWorkspaceMember } from "@/hooks/use-workspace-members";
import { useDeleteWorkspace } from "@/hooks/use-workspaces";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { WorkspaceMemberItem } from "../WorkspaceMemberItem/WorkspaceMemberItem";

interface WorkspaceMembersModalProps {
  workspaceId: string;
  workspaceName: string;
  children?: React.ReactNode;
}

export function WorkspaceMembersModal({ workspaceId, workspaceName, children }: WorkspaceMembersModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { data: members, isLoading } = useWorkspaceMembers(isOpen ? workspaceId : undefined);
  const removeMemberMutation = useRemoveWorkspaceMember();

  const navigate = useNavigate();
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const currentUser = members?.find(m => m.id === session?.user?.id);
  const canManage = currentUser?.role === "owner" || currentUser?.role === "admin";
  const isOwner = currentUser?.role === "owner";

  const handleRemoveMember = (userId: string) => {
    if (confirm("Are you sure you want to remove this member from the workspace?")) {
      removeMemberMutation.mutate({ workspaceId, userId });
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!isOwner) return;

    const confirmName = prompt(`To delete this workspace, please type "${workspaceName}" to confirm:`);
    if (confirmName !== workspaceName) {
      if (confirmName !== null) toast.error("Workspace name did not match.");
      return;
    }

    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId);
      toast.success("Workspace deleted successfully");
      setIsOpen(false);
      navigate("/home");
    } catch (error) {
      toast.error("Failed to delete workspace. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Users className="w-3.5 h-3.5" />
            {members?.length || 0} members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {workspaceName} Members
          </DialogTitle>
          <DialogDescription className="sr-only">
            Manage members and their roles in the {workspaceName} workspace.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {members?.map((member) => (
              <WorkspaceMemberItem
                key={member.id}
                member={member}
                canManage={canManage}
                currentUserId={session?.user?.id}
                onRemove={() => handleRemoveMember(member.id)}
                isRemoving={removeMemberMutation.variables?.userId === member.id}
              />
            ))}
          </div>
        )}

        {isOwner && (
          <div className="mt-6 pt-6 border-t border-destructive/10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Danger Zone</span>
              </div>
              <p className="text-xs text-muted-foreground bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                Deleting this workspace will permanently remove all associated boards, tasks, and data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                className="w-full font-bold h-11 shadow-sm shadow-destructive/20 hover:shadow-destructive/40 transition-all flex items-center justify-center gap-2 group"
                onClick={handleDeleteWorkspace}
                disabled={deleteWorkspaceMutation.isPending}
              >
                {deleteWorkspaceMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Delete Workspace
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
