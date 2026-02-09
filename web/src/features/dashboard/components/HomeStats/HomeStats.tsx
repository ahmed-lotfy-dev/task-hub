import { Star, Clock, Calendar } from "lucide-react";
import { StatCard } from "../StatCard/StatCard";

interface HomeStatsProps {
  tasksCount: number;
  workspacesCount: number;
  boardsCount: number;
}

export function HomeStats({ tasksCount, workspacesCount, boardsCount }: HomeStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group cursor-default">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Tasks</span>
            <span className="text-3xl font-black text-slate-800 font-sans">{tasksCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group cursor-default">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Workspaces</span>
            <span className="text-3xl font-black text-slate-800 font-sans">{workspacesCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group cursor-default">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Boards</span>
            <span className="text-3xl font-black text-slate-800 font-sans">{boardsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
