"use client";

import React from "react";

interface ActivityItemProps {
  user: string;
  action: string;
  target: string;
  time: string;
}

export function ActivityItem({ user, action, target, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 cursor-pointer group">
      <div className="w-10 h-10 rounded-full bg-zinc-100 border-2 border-white shadow-sm shrink-0" />
      <div className="flex flex-col">
        <p className="text-sm leading-snug">
          <span className="font-bold text-[#2D3748]">{user}</span> {action} <span className="font-bold text-primary">{target}</span>
        </p>
        <span className="text-xs text-muted-foreground mt-1">{time}</span>
      </div>
    </div>
  );
}
