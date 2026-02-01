import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/home/create-task-dialog";

interface HomeHeaderProps {
  userName: string | undefined;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-[#2D3748] tracking-tight"
        >
          Good Morning, {userName?.split(" ")[0]}! 👋
        </motion.h1>
        <p className="text-muted-foreground text-lg font-medium">
          Here's your productivity overview for today.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-11 pr-4 py-3 rounded-2xl bg-white shadow-sm border border-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 font-medium transition-all"
          />
        </div>
        <CreateTaskDialog>
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </CreateTaskDialog>
      </div>
    </header>
  );
}
