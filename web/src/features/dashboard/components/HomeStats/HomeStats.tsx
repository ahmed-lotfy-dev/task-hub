"use client";

import { Star, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HomeStatsProps {
  tasksCount: number;
  workspacesCount: number;
  boardsCount: number;
}

const stats = [
  {
    label: "Active tasks",
    key: "tasks",
    icon: Star,
  },
  {
    label: "Workspaces",
    key: "workspaces",
    icon: Clock,
  },
  {
    label: "Boards",
    key: "boards",
    icon: Calendar,
  },
];

export function HomeStats({ tasksCount, workspacesCount, boardsCount }: HomeStatsProps) {
  const values = {
    tasks: tasksCount,
    workspaces: workspacesCount,
    boards: boardsCount,
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key} className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-3xl font-extrabold text-foreground">{values[item.key]}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
