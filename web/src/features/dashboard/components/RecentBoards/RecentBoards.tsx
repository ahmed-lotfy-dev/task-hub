"use client";

import { BoardCard } from "../BoardCard/BoardCard";
import { CreateBoardDialog } from "@/features/board/components/CreateBoardDialog/CreateBoardDialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentBoardsProps {
  boards: any[] | undefined;
}

export function RecentBoards({ boards }: RecentBoardsProps) {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-violet-500",
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Recent Boards</h2>
        <div className="flex items-center gap-4">
          <CreateBoardDialog>
            <Button variant="ghost" size="sm" className="font-bold text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50/50 transition-colors gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              New Board
            </Button>
          </CreateBoardDialog>
          <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">View All</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards?.slice(0, 3).map((board, index) => (
          <BoardCard
            key={board.id}
            id={board.id}
            name={board.name}
            workspace={board.workspaceName || "Main Workspace"}
            color={colors[index % colors.length]}
            activeTasks={board.taskCount || 0}
          />
        ))}
        {(!boards || boards.length === 0) && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/40 border-2 border-dashed border-slate-200 rounded-[32px] gap-6 group hover:border-cyan-500/20 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-cyan-50 transition-colors duration-300">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 transition-colors duration-300" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-bold text-slate-700">No boards found</p>
              <p className="text-sm text-slate-500 px-8">Create your first board to start organizing your project tasks and workflows.</p>
            </div>
            <CreateBoardDialog>
              <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all bg-cyan-600 hover:bg-cyan-700 text-white">
                Create First Board
              </Button>
            </CreateBoardDialog>
          </div>
        )}
      </div>
    </section>
  );
}
