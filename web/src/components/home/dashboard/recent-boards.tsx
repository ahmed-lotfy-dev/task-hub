import { Link } from "@tanstack/react-router";
import { LayoutGrid, ChevronRight, Plus } from "lucide-react";
import { Board } from "@taskflow/shared";
import { BoardCard } from "@/components/home/board-card";
import { CreateBoardDialog } from "@/components/home/create-board-dialog";
import { Button } from "@/components/ui/button";

interface RecentBoardsProps {
  boards: Board[] | undefined;
}

export function RecentBoards({ boards }: RecentBoardsProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-primary" />
          Recent Boards
        </h2>
        <Link
          to="/boards"
          className="text-primary font-bold text-sm hover:underline cursor-pointer flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {boards?.map((board) => (
          <BoardCard
            key={board.id}
            id={board.id}
            name={board.name}
            workspace="General"
            color="bg-primary"
            activeTasks={0}
          />
        ))}
        <CreateBoardDialog>
          <div className="flex items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-zinc-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-full min-h-[160px]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-zinc-500 group-hover:text-primary">
                Create New Board
              </span>
            </div>
          </div>
        </CreateBoardDialog>
      </div>
      {boards?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-zinc-50/50 rounded-[32px] border border-zinc-100">
          <p className="text-muted-foreground font-medium mb-4">No boards yet.</p>
          <CreateBoardDialog>
            <Button variant="outline">Create your first board</Button>
          </CreateBoardDialog>
        </div>
      )}
    </section>
  );
}
