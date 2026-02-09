"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarStackProps {
  members: any[];
  maxVisible?: number;
  className?: string;
}

export function MemberAvatarStack({ members, maxVisible = 3, className }: MemberAvatarStackProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  return (
    <div className={cn("flex -space-x-2 overflow-hidden", className)}>
      {visibleMembers.map((member) => (
        <Avatar key={member.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white">
          <AvatarImage src={member.image || ""} />
          <AvatarFallback className="text-[10px] font-bold bg-zinc-50 uppercase">
            {member.name?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-zinc-100 text-[10px] font-bold text-zinc-500">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
