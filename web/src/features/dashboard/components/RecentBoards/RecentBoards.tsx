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
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Recent boards</h2>
          <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
        </div>
        <div className="flex items-center gap-3">
          <CreateBoardDialog>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              New board
            </Button>
          </CreateBoardDialog>
          <button className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            View all
          </button>
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
          <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-semibold text-foreground">No boards yet</p>
              <p className="text-sm text-muted-foreground px-6">
                Create your first board to start organizing tasks.
              </p>
            </div>
            <CreateBoardDialog>
              <Button className="rounded-xl px-6 h-10">Create board</Button>
            </CreateBoardDialog>
          </div>
        )}
      </div>
    </section>
  );
}
