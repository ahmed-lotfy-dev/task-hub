"use client";

import { MemberAvatarStack } from "../MemberAvatarStack/MemberAvatarStack";
import { cn } from "@/lib/utils";

interface MemberAvatarsProps {
  members: any[];
  maxVisible?: number;
  showCount?: boolean;
  className?: string;
}

export function MemberAvatars({
  members,
  maxVisible = 3,
  showCount = true,
  className,
}: MemberAvatarsProps) {
  if (!members || members.length === 0) {
    return (
      <div className={cn("flex items-center gap-1.5 text-zinc-400 font-medium text-xs", className)}>
        <span>No members</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MemberAvatarStack members={members} maxVisible={maxVisible} />
      {showCount && (
        <span className="text-xs font-bold text-zinc-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      )}
    </div>
  );
}
