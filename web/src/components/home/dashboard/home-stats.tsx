import { Star, Clock, Calendar } from "lucide-react";
import { StatCard } from "@/components/home/stat-card";

interface HomeStatsProps {
  tasksCount: number;
  workspacesCount: number;
  boardsCount: number;
}

export function HomeStats({ tasksCount, workspacesCount, boardsCount }: HomeStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <StatCard
        icon={<Star className="text-accent" />}
        label="Focus"
        value={`${tasksCount} Tasks`}
      />
      <StatCard
        icon={<Clock className="text-primary" />}
        label="Workspaces"
        value={`${workspacesCount}`}
      />
      <StatCard
        icon={<Calendar className="text-secondary" />}
        label="Boards"
        value={`${boardsCount}`}
      />
    </div>
  );
}
