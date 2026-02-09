import { Crown, Mail, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceMember } from "@/hooks/use-workspace-members";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface WorkspaceMemberItemProps {
  member: WorkspaceMember;
  currentUserRole?: string;
  canManage: boolean;
  currentUserId?: string;
  onRemove: () => void;
  isRemoving: boolean;
}

export function WorkspaceMemberItem({
  member,
  canManage,
  currentUserId,
  onRemove,
  isRemoving
}: WorkspaceMemberItemProps) {
  const isOwner = member.role === "owner";
  const isCurrentUser = member.id === currentUserId;

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      isRemoving && "opacity-50"
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold">{member.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{member.name}</span>
            {isOwner && <Crown className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{member.email}</span>
          </div>
          {member.joinedAt && (
            <div className="text-xs text-muted-foreground mt-0.5">
              Joined {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          isOwner ? "bg-amber-100 text-amber-700" :
            member.role === "admin" ? "bg-blue-100 text-blue-700" :
              "bg-muted text-muted-foreground"
        )}>
          {member.role}
        </span>

        {canManage && !isOwner && !isCurrentUser && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
